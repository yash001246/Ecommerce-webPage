import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link to={`/products/${product._id}`} className="card" style={{ overflow: 'hidden', display: 'block' }}>
      <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--sand)' }}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: 14 }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
          {product.category?.name || product.brand}
        </p>
        <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700 }}>₹{price.toFixed(2)}</span>
          {hasDiscount && (
            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>
        {product.numReviews > 0 && (
          <p style={{ fontSize: '0.78rem', color: 'var(--gold)', marginTop: 6 }}>
            ★ {product.ratings.toFixed(1)} ({product.numReviews})
          </p>
        )}
      </div>
    </Link>
  );
}
