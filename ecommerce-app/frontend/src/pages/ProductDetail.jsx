import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewErr, setReviewErr] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get(`/products/${id}`), api.get(`/reviews/product/${id}`)])
      .then(([p, r]) => {
        setProduct(p.data.data);
        setReviews(r.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await addToCart(product._id, qty);
    setMsg('Added to cart!');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    await api.post('/wishlist/add', { productId: product._id });
    setMsg('Added to wishlist!');
    setTimeout(() => setMsg(''), 2000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewErr('');
    try {
      await api.post('/reviews', { productId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: '' });
      loadData();
    } catch (err) {
      setReviewErr(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <div className="empty-state">Product not found.</div>;

  const price = product.discountPrice || product.price;

  return (
    <div className="container" style={{ padding: '40px 0 70px' }}>
      <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ aspectRatio: '1', background: 'var(--sand)', borderRadius: 4, overflow: 'hidden' }}>
            <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div style={{ flex: '1 1 380px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {product.category?.name} &middot; {product.brand}
          </p>
          <h1 style={{ fontSize: '2rem', margin: '8px 0' }}>{product.name}</h1>
          {product.numReviews > 0 && (
            <p style={{ color: 'var(--gold)', marginBottom: 12 }}>★ {product.ratings.toFixed(1)} ({product.numReviews} reviews)</p>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '16px 0' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 700 }}>₹{price.toFixed(2)}</span>
            {product.discountPrice > 0 && (
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{product.price.toFixed(2)}</span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>{product.description}</p>

          <p style={{ fontSize: '0.85rem', marginBottom: 16, color: product.stock > 0 ? 'var(--green)' : 'var(--coral)' }}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
          </p>

          {msg && <div className="alert alert-success">{msg}</div>}

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 80 }}>
              {Array.from({ length: Math.min(10, product.stock || 1) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <button className="btn btn-primary" disabled={product.stock === 0} onClick={handleAddToCart}>
              Add to cart
            </button>
            <button className="btn btn-secondary" onClick={handleWishlist}>♡ Wishlist</button>
          </div>
        </div>
      </div>

      <section style={{ marginTop: 60, maxWidth: 700 }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Customer reviews</h2>

        {user && (
          <form onSubmit={submitReview} className="card" style={{ padding: 20, marginBottom: 24 }}>
            {reviewErr && <div className="alert alert-error">{reviewErr}</div>}
            <div className="field">
              <label>Rating</label>
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
              </select>
            </div>
            <div className="field">
              <label>Your review</label>
              <textarea rows="3" required value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-sm" type="submit">Submit review</button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{r.user?.name || 'Anonymous'}</strong>
                <span style={{ color: 'var(--gold)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>{r.comment}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
