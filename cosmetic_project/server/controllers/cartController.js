import { supabase } from '../services/supabaseClient.js';

const getOrCreateCart = async (userId) => {
  let { data: cart } = await supabase.from('cart').select('*').eq('user_id', userId).single();
  if (!cart) {
    const { data: newCart, error } = await supabase.from('cart').insert({ user_id: userId }).select().single();
    if (error) throw error;
    cart = newCart;
  }
  return cart;
};

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const { data: items, error } = await supabase
      .from('cart_items')
      .select(`
        id, quantity, product_id,
        products (id, name, price, images, stock)
      `)
      .eq('cart_id', cart.id);
    if (error) throw error;
    res.json({ cart, items: items || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required' });
    const cart = await getOrCreateCart(req.user.id);

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      const newQty = existing.quantity + (parseInt(quantity, 10) || 1);
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ cart_id: cart.id, product_id, quantity: parseInt(quantity, 10) || 1 })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity == null || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
    const { data: item } = await supabase.from('cart_items').select('cart_id, id').eq('id', id).single();
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    const { data: cart } = await supabase.from('cart').select('user_id').eq('id', item.cart_id).single();
    if (!cart || cart.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { data, error } = await supabase.from('cart_items').update({ quantity }).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: item } = await supabase.from('cart_items').select('cart_id').eq('id', id).single();
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    const { data: cart } = await supabase.from('cart').select('user_id').eq('id', item.cart_id).single();
    if (!cart || cart.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await supabase.from('cart_items').delete().eq('id', id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};
