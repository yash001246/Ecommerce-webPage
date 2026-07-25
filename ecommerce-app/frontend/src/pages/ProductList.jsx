import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    api
      .get('/products', { params })
      .then((res) => {
        setProducts(res.data.data);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (pageNum) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', pageNum);
    setSearchParams(next);
  };

  return (
    <div className="container page">
      <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: 24 }}>
        {keyword ? `Results for "${keyword}"` : 'All products'}
      </h1>

      <div className="split-layout">
        <aside className="sidebar">
          <div className="field">
            <label>Category</label>
            <select value={category} onChange={(e) => updateParam('category', e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Sort by</label>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        <div className="main">
          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {pages > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={p === page ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
