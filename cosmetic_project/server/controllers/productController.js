import { supabase } from '../services/supabaseClient.js';
import { fetchExternalCatalog } from '../services/externalCatalogService.js';

const BASE_PRODUCT_SELECT = `
  id, name, description, ingredients, brand, price, category_id, images, stock, rating, created_at,
  categories (id, name)
`;

const REQUIRED_CATEGORY_NAMES = ['Makeup', 'Skincare', 'Haircare', 'Fragrance'];
const TABLE_NOT_FOUND_CODE = 'PGRST205';

function isTableMissingError(error) {
  return error?.code === TABLE_NOT_FOUND_CODE;
}

function mapExternalProductForApi(item, index = 0) {
  const categoryName = item.category_name || 'Makeup';
  return {
    id: `external-${item.source || 'ext'}-${item.source_id || index}`,
    name: item.name,
    description: item.description,
    ingredients: item.ingredients,
    brand: item.brand,
    price: Number(item.price) || 0,
    category_id: categoryName,
    categories: { id: categoryName, name: categoryName },
    images: item.images || [],
    stock: Number(item.stock) || 0,
    rating: Number(item.rating) || 0,
    created_at: new Date().toISOString(),
  };
}

function applyExternalFilters(products, params) {
  const { category, brand, minPrice, maxPrice, minRating, search, sort } = params;
  let rows = [...products];

  if (category) {
    const needle = String(category).toLowerCase();
    rows = rows.filter(
      (p) =>
        String(p.category_id || '').toLowerCase() === needle ||
        String(p.categories?.name || '').toLowerCase() === needle
    );
  }
  if (brand) {
    const needle = String(brand).toLowerCase();
    rows = rows.filter((p) => String(p.brand || '').toLowerCase() === needle);
  }
  if (minPrice != null && minPrice !== '') rows = rows.filter((p) => Number(p.price) >= Number(minPrice));
  if (maxPrice != null && maxPrice !== '') rows = rows.filter((p) => Number(p.price) <= Number(maxPrice));
  if (minRating != null && minRating !== '') rows = rows.filter((p) => Number(p.rating) >= Number(minRating));
  if (search) {
    const needle = String(search).toLowerCase();
    rows = rows.filter((p) =>
      [p.name, p.brand, p.description].some((field) => String(field || '').toLowerCase().includes(needle))
    );
  }

  const sortBy = String(sort || 'newest');
  if (sortBy === 'price_asc') rows.sort((a, b) => Number(a.price) - Number(b.price));
  else if (sortBy === 'price_desc') rows.sort((a, b) => Number(b.price) - Number(a.price));
  else if (sortBy === 'rating') rows.sort((a, b) => Number(b.rating) - Number(a.rating));
  else rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

  return rows;
}

function applyProductFilters(query, params) {
  const { category, brand, minPrice, maxPrice, minRating, search, sort } = params;

  if (category) query = query.eq('category_id', category);
  if (brand) query = query.eq('brand', brand);
  if (minPrice != null) query = query.gte('price', parseFloat(minPrice));
  if (maxPrice != null) query = query.lte('price', parseFloat(maxPrice));
  if (minRating != null) query = query.gte('rating', parseFloat(minRating));
  if (search) query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }
  return query;
}

async function ensureRequiredCategories() {
  const { data: existing, error: listError } = await supabase.from('categories').select('id, name');
  if (listError) throw listError;

  const byName = new Map((existing || []).map((c) => [c.name, c.id]));
  const missing = REQUIRED_CATEGORY_NAMES.filter((name) => !byName.has(name));

  if (missing.length > 0) {
    const { error: insertError } = await supabase.from('categories').insert(
      missing.map((name) => ({
        name,
        description: `${name} products`,
      }))
    );
    if (insertError) throw insertError;
  }

  const { data: refreshed, error: refreshError } = await supabase.from('categories').select('id, name');
  if (refreshError) throw refreshError;
  return new Map((refreshed || []).map((c) => [c.name, c.id]));
}

async function hydrateCatalogFromExternal() {
  const categoryIdByName = await ensureRequiredCategories();
  const externalProducts = await fetchExternalCatalog();

  if (!externalProducts.length) return 0;

  const productRows = externalProducts
    .filter((item) => item.name && item.brand)
    .map((item) => ({
      name: item.name,
      description: item.description,
      ingredients: item.ingredients,
      brand: item.brand,
      price: Number(item.price) || 0,
      category_id: categoryIdByName.get(item.category_name) || categoryIdByName.get('Makeup'),
      images: item.images || [],
      stock: Number(item.stock) || 0,
      rating: Number(item.rating) || 0,
    }));

  if (!productRows.length) return 0;

  // Insert in batches for reliability with larger payloads.
  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < productRows.length; i += BATCH_SIZE) {
    const chunk = productRows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from('products').insert(chunk).select('id');
    if (error) {
      // Ignore unique-like conflicts and continue; otherwise surface error.
      if (error.code !== '23505') throw error;
    } else {
      inserted += data?.length || 0;
    }
  }
  return inserted;
}

export const getExternalProductsLive = async (req, res) => {
  try {
    const externalProducts = await fetchExternalCatalog();
    const mapped = externalProducts.map((item, index) => mapExternalProductForApi(item, index));
    const filtered = applyExternalFilters(mapped, req.query);
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch live external products' });
  }
};

export const getProducts = async (req, res) => {
  try {
    let query = supabase.from('products').select(BASE_PRODUCT_SELECT);
    query = applyProductFilters(query, req.query);
    let { data, error } = await query;
    if (error) {
      if (isTableMissingError(error)) {
        const externalProducts = await fetchExternalCatalog();
        const mapped = externalProducts.map((item, index) => mapExternalProductForApi(item, index));
        return res.json(applyExternalFilters(mapped, req.query));
      }
      throw error;
    }

    // Auto-import external catalog once when local catalog is empty.
    if (!data?.length) {
      try {
        await hydrateCatalogFromExternal();
      } catch (hydrateError) {
        if (isTableMissingError(hydrateError)) {
          const externalProducts = await fetchExternalCatalog();
          const mapped = externalProducts.map((item, index) => mapExternalProductForApi(item, index));
          return res.json(applyExternalFilters(mapped, req.query));
        }
        throw hydrateError;
      }
      let refillQuery = supabase.from('products').select(BASE_PRODUCT_SELECT);
      refillQuery = applyProductFilters(refillQuery, req.query);
      const refill = await refillQuery;
      if (refill.error) {
        if (isTableMissingError(refill.error)) {
          const externalProducts = await fetchExternalCatalog();
          const mapped = externalProducts.map((item, index) => mapExternalProductForApi(item, index));
          return res.json(applyExternalFilters(mapped, req.query));
        }
        throw refill.error;
      }
      data = refill.data || [];
    }

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // External virtual IDs are supported even when DB tables are missing.
    if (id.startsWith('external-')) {
      const externalProducts = await fetchExternalCatalog();
      const mapped = externalProducts.map((item, index) => mapExternalProductForApi(item, index));
      const found = mapped.find((p) => p.id === id);
      if (!found) return res.status(404).json({ error: 'Product not found' });
      return res.json(found);
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (id, name, description)
      `)
      .eq('id', id)
      .single();
    if (error) {
      if (isTableMissingError(error)) {
        const externalProducts = await fetchExternalCatalog();
        const mapped = externalProducts.map((item, index) => mapExternalProductForApi(item, index));
        const found = mapped.find((p) => p.id === id);
        if (!found) return res.status(404).json({ error: 'Product not found' });
        return res.json(found);
      }
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, ingredients, brand, price, category_id, images, stock } = req.body;
    if (!name || !brand || price == null || !category_id) {
      return res.status(400).json({ error: 'Name, brand, price and category_id are required' });
    }
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        description: description || null,
        ingredients: ingredients || null,
        brand,
        price: parseFloat(price),
        category_id,
        images: images || [],
        stock: parseInt(stock, 10) || 0,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, brand, price, category_id, images, stock } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (ingredients !== undefined) updates.ingredients = ingredients;
    if (brand !== undefined) updates.brand = brand;
    if (price !== undefined) updates.price = parseFloat(price);
    if (category_id !== undefined) updates.category_id = category_id;
    if (images !== undefined) updates.images = images;
    if (stock !== undefined) updates.stock = parseInt(stock, 10);
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Product not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
