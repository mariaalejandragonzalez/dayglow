import { supabase, isSupabaseEnabled } from './supabase';
import { demoProducts, demoKits } from '../data/demoData';

/* ============================================
   AUTH
   ============================================ */

export async function signUp({ email, password, fullName, phone, city }) {
  if (!isSupabaseEnabled()) {
    return { data: { user: { id: 'demo-user', email, fullName } }, error: null };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone, city } }
  });
  return { data, error };
}

export async function signIn({ email, password }) {
  if (!isSupabaseEnabled()) {
    return { data: { user: { id: 'demo-user', email } }, error: null };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  if (!isSupabaseEnabled()) return { error: null };
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!isSupabaseEnabled()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId) {
  if (!isSupabaseEnabled()) {
    return { data: { full_name: 'Usuario Demo', email: 'demo@dayglow.com', department: 'Tolima', phone: '+57 0000000000' }, error: null };
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/* ============================================
   PRODUCTS
   ============================================ */

export async function getProducts() {
  if (!isSupabaseEnabled()) return { data: demoProducts, error: null };
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');
  return { data: data?.length ? data : demoProducts, error };
}

export async function getKits() {
  if (!isSupabaseEnabled()) return { data: demoKits, error: null };
  const { data, error } = await supabase.from('kits').select('*').order('id');
  return { data: data?.length ? data : demoKits, error };
}

/* ============================================
   CART
   ============================================ */

export async function getCart(userId) {
  if (!isSupabaseEnabled() || !userId) return { data: [], error: null };
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', userId);
  return { data: data || [], error };
}

export async function addCartItem(userId, productId, color, quantity = 1) {
  if (!isSupabaseEnabled() || !userId) return { error: null };
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('color', color)
    .maybeSingle();
  if (existing) {
    return await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
  }
  return await supabase
    .from('cart_items')
    .insert({ user_id: userId, product_id: productId, color, quantity });
}

export async function removeCartItem(userId, itemId) {
  if (!isSupabaseEnabled()) return { error: null };
  return await supabase.from('cart_items').delete().eq('id', itemId).eq('user_id', userId);
}

export async function clearCart(userId) {
  if (!isSupabaseEnabled() || !userId) return { error: null };
  return await supabase.from('cart_items').delete().eq('user_id', userId);
}

/* ============================================
   ORDERS
   ============================================ */

export async function createOrder({ userId, total, contact, address, payment, items }) {
  if (!isSupabaseEnabled() || !userId) {
    return { data: { id: Date.now() }, error: null };
  }

  // 1. Crear el pedido
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total,
      contact_name: contact.name,
      contact_phone: contact.phone,
      city: address.city,
      address: address.address,
      notes: address.notes,
      payment_method: payment.method,
    })
    .select()
    .single();
  if (error || !order) return { data: null, error };

  // 2. Crear los items del pedido
  const orderItems = items.map(i => ({
    order_id: order.id,
    product_id: i.id,
    product_name: i.name,
    product_image: i.image_url || i.image,
    color: i.color,
    quantity: i.quantity,
    price: i.price,
  }));
  await supabase.from('order_items').insert(orderItems);

  // 3. Descontar el stock de cada producto comprado
  for (const item of items) {
    // Solo descontar si es un producto real (no un kit)
    if (typeof item.id === 'number') {
      const { error: stockError } = await supabase.rpc('descontar_stock', {
        p_product_id: item.id,
        p_color: item.color,
        p_quantity: item.quantity,
      });
      if (stockError) {
        console.error('Error descontando stock:', stockError);
      }
    }
  }

  return { data: order, error: null };
}

export async function getOrders(userId) {
  if (!isSupabaseEnabled() || !userId) return { data: [], error: null };
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

/* ============================================
   ISSUES (reclamos)
   ============================================ */

export async function reportIssue(userId, orderItemId, description) {
  if (!isSupabaseEnabled() || !userId) return { error: null };
  return await supabase.from('product_issues').insert({
    user_id: userId,
    order_item_id: orderItemId,
    description,
  });
}

/* ============================================
   REVIEWS (Reseñas)
   ============================================ */

export async function getReviews(productId) {
  if (!isSupabaseEnabled()) return { data: [], error: null };
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function getUserReview(userId, productId) {
  if (!isSupabaseEnabled() || !userId) return { data: null, error: null };
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
  return { data, error };
}

export async function createReview(userId, userName, productId, rating, comment) {
  if (!isSupabaseEnabled() || !userId) return { error: null };
  return await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      user_name: userName,
      product_id: productId,
      rating,
      comment,
    });
}

export async function updateReview(reviewId, rating, comment) {
  if (!isSupabaseEnabled()) return { error: null };
  return await supabase
    .from('reviews')
    .update({ rating, comment })
    .eq('id', reviewId);
}

export async function deleteReview(reviewId) {
  if (!isSupabaseEnabled()) return { error: null };
  return await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);
}

export async function hasUserPurchased(userId, productId) {
  if (!isSupabaseEnabled() || !userId) return false;
  const { data } = await supabase
    .from('order_items')
    .select('id, orders!inner(user_id)')
    .eq('product_id', productId)
    .eq('orders.user_id', userId)
    .limit(1);
  return data && data.length > 0;
}
