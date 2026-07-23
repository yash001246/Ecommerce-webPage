import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const load = () => {
    api.get('/wishlist').then((res) => setWishlist(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (productId) => {
    await api.delete(`/wishlist/remove/${productId}`);
    load();
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 0 70px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>My wishlist</h1>
      {wishlist.products.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Browse products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {wishlist.products.map((p) => (
            <div key={p._id} className="card" style={{ overflow: 'hidden' }}>
              <Link to={`/products/${p._id}`}>
                <div style={{ aspectRatio: '1', background: 'var(--sand)' }}>
                  <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Link>
              <div style={{ padding: 14 }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontWeight: 700, marginBottom: 10 }}>₹{(p.discountPrice || p.price).toFixed(2)}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(p._id, 1)}>Add to cart</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
