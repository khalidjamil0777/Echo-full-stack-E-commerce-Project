import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('echoUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('echoUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('echoUser');
      localStorage.removeItem('echoToken');
    }
  }, [user]);

  // Register
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('echoToken', data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('echoToken', data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setCart([]);
  };

  // Refresh user points from backend
  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error('Failed to refresh user');
    }
  };

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => item._id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = cartTotal >= 2000 ? 0 : (cart.length > 0 ? 100 : 0);
  const orderTotal = cartTotal + shipping;
  const pointsToEarn = Math.floor(orderTotal / 100);

  return (
    <AppContext.Provider value={{
      user, setUser, loading,
      register, login, logout, refreshUser,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, shipping, orderTotal, pointsToEarn
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
