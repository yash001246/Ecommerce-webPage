import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <p style={{ margin: '12px 0 24px' }}>Explore our collection and find something you love.</p>
        <Link to="/products" className="btn btn-primary">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0 70px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>Your cart</h1>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 400px' }}>
          {cart.items.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', gap: 16, padding: 14, marginBottom: 12, alignItems: 'center' }}>
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹{item.price.toFixed(2)} each</p>
              </div>
              <select value={item.quantity} onChange={(e) => updateQuantity(item._id, Number(e.target.value))} style={{ width: 70 }}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <strong style={{ width: 80, textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</strong>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)}>Remove</button>
            </div>
          ))}
        </div>

        <div style={{ flex: '1 1 280px' }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Order summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 16 }}>Tax and shipping calculated at checkout.</p>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
