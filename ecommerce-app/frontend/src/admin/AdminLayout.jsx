import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const linkStyle = ({ isActive }) => ({
    display: 'block', padding: '10px 14px', borderRadius: 4, marginBottom: 4,
    background: isActive ? 'var(--ink)' : 'transparent',
    color: isActive ? 'var(--ivory)' : 'var(--ink)', fontWeight: 500, fontSize: '0.9rem',
  });

  return (
    <div className="container" style={{ padding: '40px 0 70px', display: 'flex', gap: 32 }}>
      <aside style={{ width: 200, flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Admin</h2>
        <NavLink to="/admin" end style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/admin/products" style={linkStyle}>Products</NavLink>
        <NavLink to="/admin/categories" style={linkStyle}>Categories</NavLink>
        <NavLink to="/admin/orders" style={linkStyle}>Orders</NavLink>
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
}
