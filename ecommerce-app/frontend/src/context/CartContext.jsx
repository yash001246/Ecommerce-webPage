import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) return setCart({ items: [] });
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/add', { productId, quantity });
    setCart(data.data);
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/update/${itemId}`, { quantity });
    setCart(data.data);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/remove/${itemId}`);
    setCart(data.data);
  };

  const clearCart = async () => {
    const { data } = await api.delete('/cart/clear');
    setCart(data.data);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, refreshCart, addToCart, updateQuantity, removeItem, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
