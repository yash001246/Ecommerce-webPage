import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/products/featured'), api.get('/categories')])
      .then(([p, c]) => {
        setFeatured(p.data.data);
        setCategories(c.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">New season arrivals</p>
          <h1 className="hero-title">Curated goods for everyday living.</h1>
          <p className="hero-sub">
            Electronics, fashion, and home essentials — handpicked, fairly priced, delivered fast.
          </p>
          <Link to="/products" className="btn btn-coral">Shop the collection</Link>
        </div>
      </section>

      <section className="container section">
        <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: 24 }}>Shop by category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/products?category=${cat._id}`} className="category-card">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: '10px 0 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)' }}>Featured products</h2>
          <Link to="/products" style={{ fontSize: '0.9rem', fontWeight: 600 }}>View all &rarr;</Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
