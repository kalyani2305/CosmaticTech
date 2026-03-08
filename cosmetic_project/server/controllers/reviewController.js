import { supabase } from '../services/supabaseClient.js';

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(id, name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', req.user.id)
      .single();
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    const { data, error } = await supabase
      .from('reviews')
      .insert({ product_id: productId, user_id: req.user.id, rating: parseInt(rating, 10), comment: comment || null })
      .select('*, users(id, name)')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const { data: review } = await supabase.from('reviews').select('user_id').eq('id', id).single();
    if (!review || review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own review' });
    }
    const updates = { updated_at: new Date().toISOString() };
    if (rating !== undefined) updates.rating = Math.min(5, Math.max(1, parseInt(rating, 10)));
    if (comment !== undefined) updates.comment = comment;
    const { data, error } = await supabase.from('reviews').update(updates).eq('id', id).select('*, users(id, name)').single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: review } = await supabase.from('reviews').select('user_id').eq('id', id).single();
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await supabase.from('reviews').delete().eq('id', id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
