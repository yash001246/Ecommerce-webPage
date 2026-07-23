import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState('');
  const [newAddr, setNewAddr] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' });
  const [useNew, setUseNew] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/addresses').then((res) => {
      setAddresses(res.data.data);
      if (res.data.data.length > 0) setSelected(res.data.data[0]._id);
      else setUseNew(true);
    });
  }, []);

  // Preview only — the backend recalculates and enforces the real amounts on order creation.
  const tax = 0; 
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const payWithRazorpay = async (createdOrder) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Could not load Razorpay checkout. Check your internet connection and try again.');
      return;
    }

    // Ask backend to create a matching Razorpay order for this DB order
    const { data } = await api.post('/payment/razorpay/create-order', { orderId: createdOrder._id });
    const { razorpayOrderId, amount, currency, keyId } = data.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: 'ShopEase',
      description: `Order #${createdOrder._id.slice(-8).toUpperCase()}`,
      order_id: razorpayOrderId,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: { color: '#1b2a4a' },
      handler: async (response) => {
        try {
          await api.post('/payment/razorpay/verify', {
            orderId: createdOrder._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await clearCart();
          navigate(`/orders/${createdOrder._id}`);
        } catch (err) {
          setError(err.response?.data?.message || 'Payment verification failed. Contact support if the amount was deducted.');
          navigate(`/orders/${createdOrder._id}`);
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          setError('Payment cancelled. Your order was created but is still unpaid — you can retry payment from the order page.');
          navigate(`/orders/${createdOrder._id}`);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => {
      setSubmitting(false);
      setError(`Payment failed: ${resp.error.description || 'please try again'}.`);
    });
    rzp.open();
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let shippingAddress;
      if (useNew) {
        shippingAddress = newAddr;
        await api.post('/addresses', newAddr);
      } else {
        const addr = addresses.find((a) => a._id === selected);
        shippingAddress = addr;
      }

      const items = cart.items.map((i) => ({ product: i.product, quantity: i.quantity }));
      const { data } = await api.post('/orders', { items, shippingAddress, paymentMethod });
      const createdOrder = data.data;

      if (paymentMethod === 'Razorpay') {
        // Cart is cleared only after payment is verified (see handler above)
        await payWithRazorpay(createdOrder);
      } else {
        await clearCart();
        navigate(`/orders/${createdOrder._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: 24 }}>Checkout</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={placeOrder} className="two-col">
        <div className="col-main">
          <h3 style={{ marginBottom: 12 }}>Shipping address</h3>
          {addresses.length > 0 && !useNew && (
            <div style={{ marginBottom: 16 }}>
              {addresses.map((a) => (
                <label key={a._id} className="card" style={{ display: 'flex', gap: 10, padding: 14, marginBottom: 8, alignItems: 'flex-start' }}>
                  <input type="radio" name="addr" checked={selected === a._id} onChange={() => setSelected(a._id)} style={{ marginTop: 4 }} />
                  <span style={{ fontSize: '0.9rem' }}>
                    <strong>{a.fullName}</strong> &middot; {a.phone}<br />
                    {a.addressLine1}, {a.city}, {a.state} {a.postalCode}, {a.country}
                  </span>
                </label>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setUseNew(true)}>+ Use a new address</button>
            </div>
          )}

          {useNew && (
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div className="form-row-2">
                <div className="field"><label>Full name</label><input className="input" required value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} /></div>
                <div className="field"><label>Phone</label><input className="input" required value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} /></div>
              </div>
              <div className="field"><label>Address line 1</label><input className="input" required value={newAddr.addressLine1} onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })} /></div>
              <div className="field"><label>Address line 2</label><input className="input" value={newAddr.addressLine2} onChange={(e) => setNewAddr({ ...newAddr, addressLine2: e.target.value })} /></div>
              <div className="form-row-3">
                <div className="field"><label>City</label><input className="input" required value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} /></div>
                <div className="field"><label>State</label><input className="input" required value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} /></div>
                <div className="field"><label>Postal code</label><input className="input" required value={newAddr.postalCode} onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })} /></div>
              </div>
              {addresses.length > 0 && <button type="button" className="btn btn-secondary btn-sm" onClick={() => setUseNew(false)}>Use saved address instead</button>}
            </div>
          )}

          <h3 style={{ margin: '20px 0 12px' }}>Payment method</h3>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="Razorpay">Pay online (Razorpay) — Card / UPI / Netbanking / Wallet</option>
          </select>
        </div>

        <div className="col-side">
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Order total</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Tax (GST 18%)</span><span>₹{tax.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span>Shipping </span><span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: 12, marginBottom: 20 }}>
              <span>Total</span><span>₹{total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting} type="submit">
              {submitting ? 'Processing...' : paymentMethod === 'Razorpay' ? 'Proceed to pay' : 'Place order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}