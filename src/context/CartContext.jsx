import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [toast, setToast] = useState('');

  // Keep the cart saved in the browser.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Auto-hide the toast message.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function add(product, quantity = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        id: product.id, name: product.name, price: product.price,
        image: product.image, quantity
      }];
    });
    setToast(`Added "${product.name}" to cart`);
  }

  function setQty(id, quantity) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
  }

  function remove(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
      {toast && <div className="toast">✓ {toast}</div>}
    </CartContext.Provider>
  );
}
