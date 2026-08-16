import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiGet } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import Product3DView from '../components/Product3DView.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    apiGet(`/api/products/${id}`)
      .then(d => { setProduct(d && !d.error ? d : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container"><div className="detail"><div className="card skeleton view3d" /><div /></div></div>;
  }
  if (!product) {
    return (
      <div className="container empty">
        <div className="empty-ico">🔍</div>
        Sorry, that product was not found.<br /><br />
        <Link to="/" className="btn">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Shop</Link> <span>/</span> {product.category} <span>/</span> {product.name}
      </div>

      <div className="detail">
        {/* Interactive 3D image view */}
        <Product3DView image={product.image} name={product.name} />

        <div className="detail-info">
          <span className="detail-cat">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span className="muted">4.9 · 128 reviews</span>
          </div>
          <div className="detail-price">${product.price.toFixed(2)}</div>
          <p className="detail-desc">{product.description}</p>

          <ul className="detail-feats">
            <li><span className="tick">✓</span> In stock — {product.stock} available</li>
            <li><span className="tick">✓</span> Free shipping on orders over $100</li>
            <li><span className="tick">✓</span> 2-year warranty included</li>
          </ul>

          <div className="qty-row">
            <div className="qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Increase">+</button>
            </div>
            <button className="btn btn-lg" onClick={() => add(product, qty)}>Add to cart</button>
          </div>
          <button
            className="btn btn-outline btn-block"
            onClick={() => { add(product, qty); navigate('/cart'); }}
          >Buy it now</button>
        </div>
      </div>

      {/* ---------- Extra details section ---------- */}
      <section className="detail-extra">
        <h2>Product details</h2>
        <div className="detail-extra-grid">
          <div className="extra-card">
            <h4>📝 Description</h4>
            <p>{product.description} Designed to blend seamlessly into your everyday setup with premium materials and a refined finish.</p>
          </div>
          <div className="extra-card">
            <h4>⚙️ Specifications</h4>
            <ul className="spec-list">
              <li><span>Category</span><span>{product.category}</span></li>
              <li><span>SKU</span><span>MS-{String(product.id).padStart(4, '0')}</span></li>
              <li><span>In stock</span><span>{product.stock} units</span></li>
              <li><span>Warranty</span><span>2 years</span></li>
            </ul>
          </div>
          <div className="extra-card">
            <h4>🚚 Shipping &amp; returns</h4>
            <p>Free standard shipping on orders over $100 (2–4 business days). Not happy? Return it within 30 days for a full refund, no questions asked.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
