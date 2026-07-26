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
    <div className="container page">
      <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: 24 }}>Your cart</h1>
      <div className="two-col">
        <div className="col-main">
          {cart.items.map((item) => (
            <div key={item._id} className="card cart-item">
              <div className="cart-item-media">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
                <div className="cart-item-info">
                  <h3 style={{ fontSize: '1rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹{item.price.toFixed(2)} each</p>
                </div>
              </div>
              <div className="cart-item-actions">
                <select value={item.quantity} onChange={(e) => updateQuantity(item._id, Number(e.target.value))} style={{ width: 70 }}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <strong style={{ minWidth: 80, textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</strong>
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="col-side">
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