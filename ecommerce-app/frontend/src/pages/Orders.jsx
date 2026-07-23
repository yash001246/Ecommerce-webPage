import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then((res) => setOrders(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 0 70px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>My orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Start shopping</Link>
        </div>
      ) : (
        orders.map((o) => (
          <Link key={o._id} to={`/orders/${o._id}`} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 18, marginBottom: 12 }}>
            <div>
              <strong>Order #{o._id.slice(-8).toUpperCase()}</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
                {new Date(o.createdAt).toLocaleDateString()} &middot; {o.items.length} item(s)
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>₹{o.totalPrice.toFixed(2)}</p>
              <span className={`badge badge-${o.status}`}>{o.status}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
