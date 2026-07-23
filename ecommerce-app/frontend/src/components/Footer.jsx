export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 80, padding: '40px 0', background: '#fff' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem' }}>ShopEase</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} ShopEase. Built with React, Node & MongoDB.
        </p>
      </div>
    </footer>
  );
}
