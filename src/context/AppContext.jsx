import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import * as db from '../lib/db';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState('login');

  // Auth
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data
  const [products, setProducts] = useState([]);
  const [kits, setKits] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderInfo, setOrderInfo] = useState({ contact: {}, address: {}, payment: {} });

  // Accessibility
  const [fontSize, setFontSize] = useState(() =>
    parseInt(localStorage.getItem('dg-fontsize')) || 16
  );
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dg-dark') === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('dg-contrast') === 'true');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply accessibility settings to DOM
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('dg-fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.body.className = [
      darkMode ? 'dark-mode' : '',
      highContrast ? 'high-contrast' : ''
    ].filter(Boolean).join(' ');
    localStorage.setItem('dg-dark', darkMode);
    localStorage.setItem('dg-contrast', highContrast);
  }, [darkMode, highContrast]);

  // Restore session on load
  useEffect(() => {
    const init = async () => {
      // Cargar productos y kits siempre
      const [{ data: prods }, { data: kts }] = await Promise.all([
        db.getProducts(),
        db.getKits(),
      ]);
      setProducts(prods || []);
      setKits(kts || []);

      // Verificar sesión
      if (isSupabaseEnabled()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserData(session.user);
        }

        // Listener para cambios de sesión
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) await loadUserData(session.user);
          else { setUser(null); setProfile(null); setCart([]); setOrders([]); }
        });
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async (authUser) => {
    setUser(authUser);
    const { data: prof } = await db.getProfile(authUser.id);
    setProfile(prof);
    const { data: cartData } = await db.getCart(authUser.id);
    setCart(cartData.map(i => ({
      cart_id: i.id,
      id: i.product_id,
      name: i.products?.name,
      price: i.products?.price,
      image_url: i.products?.image_url,
      color: i.color,
      quantity: i.quantity,
    })));
    const { data: ordData } = await db.getOrders(authUser.id);
    setOrders(ordData);
    setCurrentPage('catalog');
  };

  // ─── Auth actions ───
  const register = async ({ name, email, phone, password, city }) => {
    const { data, error } = await db.signUp({ email, password, fullName: name, phone, city });
    if (error) return { success: false, message: error.message };
    if (!isSupabaseEnabled()) {
      // Modo demo
      setUser({ id: 'demo-user', email });
      setProfile({ full_name: name, email, phone, city, department: 'Tolima' });
      setCurrentPage('catalog');
    }
    return { success: true, data };
  };

  const login = async ({ email, password }) => {
    const { data, error } = await db.signIn({ email, password });
    if (error) return { success: false, message: error.message };
    if (!isSupabaseEnabled()) {
      setUser({ id: 'demo-user', email });
      setProfile({ full_name: 'Usuario Demo', email, department: 'Tolima', phone: '+57 0000000000' });
      setCurrentPage('catalog');
    }
    return { success: true, data };
  };

  const logout = async () => {
    await db.signOut();
    setUser(null); setProfile(null); setCart([]); setOrders([]);
    stopSpeaking();
    setCurrentPage('login');
  };

  // ─── Cart actions ───
  const addToCart = async (product) => {
    if (user?.id && isSupabaseEnabled()) {
      await db.addCartItem(user.id, product.id, product.color, 1);
      const { data } = await db.getCart(user.id);
      setCart(data.map(i => ({
        cart_id: i.id,
        id: i.product_id,
        name: i.products?.name,
        price: i.products?.price,
        image_url: i.products?.image_url,
        color: i.color,
        quantity: i.quantity,
      })));
    } else {
      // Modo demo: en memoria
      setCart(prev => {
        const ex = prev.find(i => i.id === product.id && i.color === product.color);
        if (ex) return prev.map(i =>
          i.id === product.id && i.color === product.color
            ? { ...i, quantity: i.quantity + 1 } : i
        );
        return [...prev, { ...product, quantity: 1, image_url: product.image_url || product.image }];
      });
    }
  };

  const removeFromCart = async (item) => {
    if (item.cart_id && isSupabaseEnabled()) {
      await db.removeCartItem(user.id, item.cart_id);
    }
    setCart(prev => prev.filter(i =>
      i.cart_id ? i.cart_id !== item.cart_id : !(i.id === item.id && i.color === item.color)
    ));
  };

  const placeOrder = async () => {
    if (!user) return { success: false };
    const { data, error } = await db.createOrder({
      userId: user.id,
      total: cartTotal,
      contact: orderInfo.contact,
      address: orderInfo.address,
      payment: orderInfo.payment,
      items: cart,
    });
    if (error) return { success: false, message: error.message };

    if (user.id && isSupabaseEnabled()) await db.clearCart(user.id);
    setCart([]);

    // Refrescar pedidos
    if (isSupabaseEnabled()) {
      const { data: ordData } = await db.getOrders(user.id);
      setOrders(ordData);
    } else {
      // Demo: mantener pedido en memoria
      setOrders(prev => [{ ...data, order_items: cart, total: cartTotal, status: 'Pendiente', created_at: new Date().toISOString() }, ...prev]);
    }

    // 🆕 Refrescar productos (para ver stock actualizado)
    const { data: freshProducts } = await db.getProducts();
    if (freshProducts) setProducts(freshProducts);

    return { success: true, orderId: data?.id };
  };

  const cartTotal = cart.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // ─── Accessibility ───
  const increaseFontSize = () => setFontSize(p => Math.min(p + 2, 24));
  const decreaseFontSize = () => setFontSize(p => Math.max(p - 2, 12));

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) { setIsSpeaking(false); return; }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-CO';
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  }, [isSpeaking]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      user, profile, loading,
      register, login, logout,
      products, kits,
      cart, addToCart, removeFromCart, cartTotal, cartCount,
      orders, placeOrder,
      selectedProduct, setSelectedProduct,
      orderInfo, setOrderInfo,
      fontSize, increaseFontSize, decreaseFontSize,
      darkMode, setDarkMode,
      highContrast, setHighContrast,
      speak, stopSpeaking, isSpeaking,
      isSupabaseEnabled: isSupabaseEnabled(),
    }}>
      {children}
    </AppContext.Provider>
  );
};
