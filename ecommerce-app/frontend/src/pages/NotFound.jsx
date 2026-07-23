import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container empty-state">
      <h1 style={{ fontSize: '2.4rem', marginBottom: 12 }}>404</h1>
      <p style={{ marginBottom: 20 }}>Page not found.</p>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}
