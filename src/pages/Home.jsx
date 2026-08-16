import { useEffect, useState, useMemo } from 'react';
import { apiGet } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

const FEATURES = [
  { icon: '🚚', title: 'Free shipping', text: 'On all orders over $100' },
  { icon: '🔒', title: 'Secure checkout', text: 'Encrypted & protected' },
  { icon: '↩️', title: 'Easy returns', text: '30-day money back' },
  { icon: '🛡️', title: '2-year warranty', text: 'On every product' }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    apiGet('/api/products')
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-pill">✨ Free shipping on orders over $100</span>
            <h1>Tech that fits<br /><span className="grad">your life.</span></h1>
            <p>Premium electronics, handpicked and delivered fast. Discover your next favourite gadget at MiniShop.</p>
            <div className="hero-cta">
              <a href="#products" className="btn btn-lg">Shop now</a>
              <a href="#products" className="btn btn-ghost btn-lg">Browse deals</a>
            </div>
            <div className="hero-stats">
              <div><strong>10k+</strong><span>Happy customers</span></div>
              <div><strong>4.9★</strong><span>Average rating</span></div>
              <div><strong>24/7</strong><span>Support</span></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="float-card fc1"><img src="/images/headphones.jpg" alt="Headphones" /></div>
            <div className="float-card fc2"><img src="/images/watch.jpg" alt="Smart watch" /></div>
            <div className="float-card fc3"><img src="/images/camera.jpg" alt="Camera" /></div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURE STRIP ---------- */}
      <section className="container">
        <div className="feature-strip">
          {FEATURES.map(f => (
            <div className="feature" key={f.title}>
              <span className="feature-ico">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <span>{f.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- PRODUCTS ---------- */}
      <section id="products" className="container products-section">
        <div className="section-head">
          <div>
            <h2>All Products</h2>
            <p className="muted">{filtered.length} item{filtered.length !== 1 ? 's' : ''} available</p>
          </div>
          <div className="search-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              className="search"
              placeholder="Search products…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chips">
          {categories.map(c => (
            <button
              key={c}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>

        {loading ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => <div className="card skeleton" key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty"><div className="empty-ico">🔍</div>No products match your search.</div>
        ) : (
          <div className="grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
