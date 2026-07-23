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
      <section style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '90px 0' }}>
        <div className="container">
          <p style={{ color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 16 }}>
            New season arrivals
          </p>
          <h1 style={{ fontSize: '3.2rem', maxWidth: 620, lineHeight: 1.1, marginBottom: 20 }}>
            Curated goods for everyday living.
          </h1>
          <p style={{ maxWidth: 480, color: '#cdd3e0', marginBottom: 32, fontSize: '1.05rem' }}>
            Electronics, fashion, and home essentials — handpicked, fairly priced, delivered fast.
          </p>
          <Link to="/products" className="btn btn-coral">Shop the collection</Link>
        </div>
      </section>

      <section className="container" style={{ padding: '56px 0' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: 24 }}>Shop by category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="card"
              style={{ padding: 24, textAlign: 'center', background: 'var(--sand)', border: 'none' }}
            >
              <h3 style={{ fontSize: '1.05rem' }}>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: '20px 0 70px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.6rem' }}>Featured products</h2>
          <Link to="/products" style={{ fontSize: '0.9rem', fontWeight: 600 }}>View all &rarr;</Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
