import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiPost } from '../api.js';

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [ship, setShip] = useState({ name: '', address: '', city: '' });
  const [msg, setMsg] = useState(null);
  const [placing, setPlacing] = useState(false);

  const shipping = total >= 100 ? 0 : 5;

  async function checkout() {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!ship.name || !ship.address || !ship.city) {
      setMsg({ type: 'error', text: 'Please fill in all shipping fields.' });
      return;
    }
    setPlacing(true);
    const res = await apiPost('/api/orders', {
      items: items.map(i => ({ id: i.id, quantity: i.quantity })),
      shipping: ship
    });
    setPlacing(false);
    if (!res.ok) { setMsg({ type: 'error', text: res.data.error || 'Something went wrong.' }); return; }
    clear();
    navigate('/orders', { state: { justOrdered: res.data.orderNumber } });
  }

  if (items.length === 0) {
    return (
      <div className="container empty">
        <div className="empty-ico">🛒</div>
        Your cart is empty.<br /><br />
        <Link to="/" className="btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="panel">
          {items.map(i => (
            <div className="cart-row" key={i.id}>
              <img className="cart-thumb" src={i.image} alt={i.name} />
              <div className="cart-info">
                <Link to={`/product/${i.id}`} className="cart-name">{i.name}</Link>
                <span className="muted">${i.price.toFixed(2)} each</span>
                <button className="linkbtn danger" onClick={() => remove(i.id)}>Remove</button>
              </div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.quantity - 1)}>−</button>
                <span>{i.quantity}</span>
                <button onClick={() => setQty(i.id, i.quantity + 1)}>+</button>
              </div>
              <div className="cart-line">${(i.price * i.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <aside className="cart-side">
          <div className="panel">
            <h3>Order summary</h3>
            <div className="sum-line"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="sum-line"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : '$5.00'}</span></div>
            <div className="sum-total"><span>Total</span><span>${(total + shipping).toFixed(2)}</span></div>
          </div>

          <div className="panel">
            <h3>Shipping details</h3>
            {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
            {!isLoggedIn && <div className="msg info">Please <Link to="/login">log in</Link> to check out.</div>}
            <label className="field">Full name
              <input value={ship.name} onChange={e => setShip({ ...ship, name: e.target.value })} placeholder="Jane Doe" />
            </label>
            <label className="field">Address
              <input value={ship.address} onChange={e => setShip({ ...ship, address: e.target.value })} placeholder="123 Main Street" />
            </label>
            <label className="field">City
              <input value={ship.city} onChange={e => setShip({ ...ship, city: e.target.value })} placeholder="Your city" />
            </label>
            <button className="btn btn-block btn-lg" disabled={placing} onClick={checkout}>
              {placing ? 'Placing order…' : `Place order · $${(total + shipping).toFixed(2)}`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
