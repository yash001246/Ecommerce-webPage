import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const cancelOrder = async () => {
    try {
      await api.put(`/orders/${id}/cancel`);
      setMsg('Order cancelled.');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not cancel order');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="empty-state">Order not found.</div>;

  return (
    <div className="container" style={{ padding: '40px 0 70px', maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem' }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`badge badge-${order.status}`}>{order.status}</span>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: idx < order.items.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'center' }}>
            <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600 }}>{item.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} &times; ₹{item.price.toFixed(2)}</p>
            </div>
            <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: 20, flex: '1 1 280px' }}>
          <h3 style={{ marginBottom: 10 }}>Shipping address</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {order.shippingAddress?.fullName}<br />
            {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}<br />
            {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}<br />
            {order.shippingAddress?.phone}
          </p>
        </div>
        <div className="card" style={{ padding: 20, flex: '1 1 220px' }}>
          <h3 style={{ marginBottom: 10 }}>Payment summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}><span>Items</span><span>₹{order.itemsPrice.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}><span>Tax</span><span>₹{order.taxPrice.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}><span>Shipping</span><span>₹{order.shippingPrice.toFixed(2)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: 8 }}><span>Total</span><span>₹{order.totalPrice.toFixed(2)}</span></div>
          <p style={{ marginTop: 10, fontSize: '0.85rem' }}>Payment: {order.paymentMethod} {order.isPaid ? '(Paid)' : '(Unpaid)'}</p>
        </div>
      </div>

      {['pending', 'processing'].includes(order.status) && (
        <button className="btn btn-danger" style={{ marginTop: 20 }} onClick={cancelOrder}>Cancel order</button>
      )}
    </div>
  );
}
