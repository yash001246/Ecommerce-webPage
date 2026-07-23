import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/products?keyword=${encodeURIComponent(query)}` : '/products');
  };

  return (
    <header style={{ borderBottom: '1px solid var(--line)', background: '#fff', position: 'sticky', top: 0, zIndex: 20 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24, height: 72 }}>
        <Link to="/" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Sh<span style={{ color: 'var(--coral)' }}>o</span>pEase
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, display: 'flex' }}>
          <input
            className="input"
            style={{ borderRadius: '4px 0 0 4px' }}
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" style={{ borderRadius: '0 4px 4px 0' }} type="submit">
            Search
          </button>
        </form>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto', fontSize: '0.9rem', fontWeight: 500 }}>
          <Link to="/products">Shop</Link>
          {user && <Link to="/wishlist">Wishlist</Link>}
          {user && <Link to="/orders">Orders</Link>}
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          <Link to="/cart" style={{ position: 'relative' }}>
            Cart
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute', top: -10, right: -16, background: 'var(--coral)', color: '#fff',
                  borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                }}
              >
                {itemCount}
              </span>
            )}
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
      </div>
    </header>
  );
}
