export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 60, padding: '36px 0', background: '#fff' }}>
      <div className="container footer-inner">
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem' }}>ShopEase</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} ShopEase. Built with React, Node &amp; MongoDB.
        </p>
      </div>
    </footer>
  );
}
