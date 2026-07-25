import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount ? Math.round(100 - (product.discountPrice / product.price) * 100) : 0;

  return (
    <Link to={`/products/${product._id}`} className="card product-card">
      <div className="product-card-img">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          loading="lazy"
        />
        {hasDiscount && <span className="discount-tag">{discountPct}% OFF</span>}
      </div>
      <div className="product-card-body">
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
          {product.category?.name || product.brand}
        </p>
        <h3 style={{ fontSize: '0.98rem', marginBottom: 8, lineHeight: 1.3 }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700 }}>₹{price.toFixed(2)}</span>
          {hasDiscount && (
            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
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
