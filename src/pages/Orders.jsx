import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiGet } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Orders() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const justOrdered = location.state?.justOrdered;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    apiGet('/api/orders')
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="container empty">
        <div className="empty-ico">🔒</div>
        Please <Link to="/login">log in</Link> to see your orders.
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">My Orders</h1>
      {justOrdered && <div className="msg success">🎉 Order #{justOrdered} placed successfully! Thank you.</div>}

      {loading ? (
        <div className="panel skeleton" style={{ height: 130 }} />
      ) : orders.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">📦</div>
          You haven't placed any orders yet.<br /><br />
          <Link to="/" className="btn">Start shopping</Link>
        </div>
      ) : (
        orders.map(o => (
          <div className="panel order" key={o._id || o.orderNumber}>
            <div className="order-head">
              <strong>Order #{o.orderNumber}</strong>
              <span className="badge-status">{o.status}</span>
            </div>
            <div className="muted small">{new Date(o.createdAt).toLocaleString()}</div>
            <div className="order-items">
              {o.items.map((it, idx) => (
                <div className="order-item" key={idx}>
                  <span>{it.name} <span className="muted">× {it.quantity}</span></span>
                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="sum-total"><span>Total</span><span>${o.total.toFixed(2)}</span></div>
          </div>
        ))
      )}
    </div>
  );
}
