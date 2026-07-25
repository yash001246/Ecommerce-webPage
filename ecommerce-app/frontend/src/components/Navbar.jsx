import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/products?keyword=${encodeURIComponent(query)}` : '/products');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            Sh<span className="accent">o</span>pEase
          </Link>

          <form onSubmit={handleSearch} className="navbar-search">
            <input
              className="input"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>

          <nav className="navbar-links">
            <Link to="/products">Shop</Link>
            {user && <Link to="/wishlist">Wishlist</Link>}
            {user && <Link to="/orders">Orders</Link>}
            {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
            <Link to="/cart" className="cart-pill">
              Cart
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/profile">{user.name.split(' ')[0]}</Link>
                <button className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
              </>
            )}
          </nav>

          <button
            className="hamburger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <form onSubmit={handleSearch} className="mobile-search" style={{ marginBottom: 10, width: '100%' }}>
              <input
                className="input"
                style={{ borderRadius: '4px 0 0 4px' }}
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-primary" style={{ borderRadius: '0 4px 4px 0' }} type="submit">Go</button>
            </form>
            <Link to="/products" onClick={closeMenu}>Shop</Link>
            {user && <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>}
            {user && <Link to="/orders" onClick={closeMenu}>Orders</Link>}
            {user?.role === 'admin' && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
            <Link to="/cart" onClick={closeMenu}>Cart {itemCount > 0 ? `(${itemCount})` : ''}</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={closeMenu}>My profile</Link>
                <button className="link-btn" onClick={() => { logout(); closeMenu(); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>Login</Link>
                <Link to="/register" onClick={closeMenu}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
