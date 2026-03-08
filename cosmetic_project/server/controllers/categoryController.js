import { supabase } from '../services/supabaseClient.js';

const FALLBACK_CATEGORIES = [
  { id: 'Makeup', name: 'Makeup', description: 'Lipsticks, foundations, eyeshadows, and more' },
  { id: 'Skincare', name: 'Skincare', description: 'Serums, moisturizers, toners, and cleansers' },
  { id: 'Haircare', name: 'Haircare', description: 'Shampoos, conditioners, serums, and treatments' },
  { id: 'Fragrance', name: 'Fragrance', description: 'Perfumes and body mists' },
];

export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      if (error.code === 'PGRST205') {
        return res.json(FALLBACK_CATEGORIES);
      }
      throw error;
    }
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const { data, error } = await supabase.from('categories').insert({ name, description: description || null }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updates = { name, description };
    if (name === undefined) delete updates.name;
    if (description === undefined) delete updates.description;
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Category not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
