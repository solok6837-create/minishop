export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="logo">Mini<span>Shop</span></div>
          <p className="footer-tag">Premium electronics, delivered fast.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Shop</h4>
            <a href="/">All products</a>
            <a href="/">Audio</a>
            <a href="/">Accessories</a>
          </div>
          <div>
            <h4>Help</h4>
            <a href="/">Shipping</a>
            <a href="/">Returns</a>
            <a href="/">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} MiniShop · Built with React, Express &amp; MongoDB
      </div>
    </footer>
  );
}
