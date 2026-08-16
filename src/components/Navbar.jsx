import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { isLoggedIn, name, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">Mini<span>Shop</span></Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Shop</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
              <button className="linkbtn" onClick={logout}>Logout{name ? ` (${name.split(' ')[0]})` : ''}</button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
          )}
          <Link to="/cart" className="cart-link" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
