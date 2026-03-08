import { supabase } from '../services/supabaseClient.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping_address, items } = req.body; // items: [{ product_id, quantity }]
    if (!shipping_address || !items?.length) {
      return res.status(400).json({ error: 'Shipping address and items are required' });
    }

    const productIds = items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabase.from('products').select('id, price, stock').in('id', productIds);
    if (productsError || !products?.length) {
      return res.status(400).json({ error: 'Invalid products' });
    }

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    let totalPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const product = productMap[item.product_id];
      if (!product) return res.status(400).json({ error: `Product ${item.product_id} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.product_id}` });
      }
      const price = product.price;
      totalPrice += price * item.quantity;
      orderItems.push({ product_id: item.product_id, quantity: item.quantity, price });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, total_price: totalPrice, status: 'processing', shipping_address })
      .select()
      .single();
    if (orderError) throw orderError;

    for (const oi of orderItems) {
      await supabase.from('order_items').insert({ order_id: order.id, ...oi });
    }
    for (const item of items) {
      try {
        const { error: rpcError } = await supabase.rpc('decrement_stock', {
          p_id: item.product_id,
          amount: item.quantity,
        });
        if (rpcError) throw rpcError;
      } catch {
        // Ignore RPC errors: we keep the direct update fallback below.
      }
      const p = productMap[item.product_id];
      if (p) {
        await supabase.from('products').update({ stock: p.stock - item.quantity }).eq('id', item.product_id);
      }
    }

    const { data: fullOrder } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', order.id)
      .single();
    res.status(201).json(fullOrder || order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(id, name, images, price))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(id, name, images, price))')
      .eq('id', id)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Order not found' });
    if (data.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const { data, error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), users(id, name, email)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};