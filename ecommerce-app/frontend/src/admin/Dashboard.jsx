import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/orders/admin/stats').then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <div className="spinner" />;

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 6 }}>Total orders</p>
          <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.totalOrders}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 6 }}>Total revenue</p>
          <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>Orders by status</h3>
      <table className="card">
        <thead><tr><th>Status</th><th>Count</th></tr></thead>
        <tbody>
          {stats.statusCounts.map((s) => (
            <tr key={s._id}><td><span className={`badge badge-${s._id}`}>{s._id}</span></td><td>{s.count}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
