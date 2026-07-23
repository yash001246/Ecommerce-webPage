import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await login(form.email, form.password);
    setSubmitting(false);
    if (res.success) navigate(location.state?.from || '/');
    else setError(res.message);
  };

  return (
    <div className="container" style={{ maxWidth: 420, padding: '70px 24px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Welcome back</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Log in to continue shopping.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary btn-block" disabled={submitting} type="submit">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--ink)', fontWeight: 600 }}>Sign up</Link>
      </p>
      
    </div>
  );
}
