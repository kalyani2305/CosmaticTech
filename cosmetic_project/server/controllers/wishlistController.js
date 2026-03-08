import { supabase } from '../services/supabaseClient.js';

export const getWishlist = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        id, product_id, created_at,
        products (id, name, price, images, rating, brand)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required' });
    const { data, error } = await supabase
      .from('wishlist')
      .insert({ user_id: req.user.id, product_id })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Already in wishlist' });
      throw error;
    }
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', productId);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};
