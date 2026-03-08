const DUMMYJSON_BASE = 'https://dummyjson.com/products/category';
const MAKEUP_API_BASE = 'https://makeup-api.herokuapp.com/api/v1/products.json';

const CATEGORY_MAP = {
  beauty: 'Makeup',
  makeup: 'Makeup',
  skincare: 'Skincare',
  'skin-care': 'Skincare',
  haircare: 'Haircare',
  'hair-care': 'Haircare',
  fragrances: 'Fragrance',
  fragrance: 'Fragrance',
  perfume: 'Fragrance',
};

function mapCategory(raw) {
  if (!raw) return 'Makeup';
  const key = String(raw).trim().toLowerCase();
  return CATEGORY_MAP[key] || 'Makeup';
}

function normalizeDummyJsonProduct(product) {
  return {
    source: 'dummyjson',
    source_id: String(product.id),
    name: product.title,
    description: product.description || null,
    ingredients: null,
    brand: product.brand || 'Beauty Brand',
    price: Number(product.price) || 0,
    category_name: mapCategory(product.category),
    images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
    stock: Number(product.stock) || 0,
    rating: Number(product.rating) || 0,
  };
}

function normalizeMakeupApiProduct(product) {
  const images = [];
  if (product.image_link) images.push(product.image_link);
  return {
    source: 'makeup-api',
    source_id: String(product.id),
    name: product.name || `${product.brand || 'Makeup'} Product`,
    description: product.description || null,
    ingredients: Array.isArray(product.tag_list) ? product.tag_list.join(', ') : null,
    brand: product.brand || 'Makeup Brand',
    price: Number(product.price) || 0,
    category_name: mapCategory(product.product_type || product.category),
    images,
    stock: 100,
    rating: 4.2,
  };
}

async function fetchDummyJsonCategory(category) {
  const res = await fetch(`${DUMMYJSON_BASE}/${category}`);
  if (!res.ok) throw new Error(`DummyJSON fetch failed for ${category}`);
  const body = await res.json();
  const products = Array.isArray(body.products) ? body.products : [];
  return products.map(normalizeDummyJsonProduct);
}

async function fetchMakeupApiByType(productType) {
  const url = `${MAKEUP_API_BASE}?product_type=${encodeURIComponent(productType)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Makeup API fetch failed for ${productType}`);
  const body = await res.json();
  const products = Array.isArray(body) ? body : [];
  return products.slice(0, 12).map(normalizeMakeupApiProduct);
}

export async function fetchExternalCatalog() {
  const jobs = [
    fetchDummyJsonCategory('beauty'),
    fetchDummyJsonCategory('fragrances'),
    fetchDummyJsonCategory('skin-care'),
    fetchMakeupApiByType('lipstick'),
    fetchMakeupApiByType('foundation'),
    fetchMakeupApiByType('mascara'),
  ];

  const settled = await Promise.allSettled(jobs);
  const merged = [];

  for (const result of settled) {
    if (result.status === 'fulfilled') merged.push(...result.value);
  }

  // Deduplicate by normalized name + brand to avoid repeated inserts.
  const seen = new Set();
  const deduped = [];
  for (const item of merged) {
    const key = `${item.name}`.trim().toLowerCase() + '::' + `${item.brand}`.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

