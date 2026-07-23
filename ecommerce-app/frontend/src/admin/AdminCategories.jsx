import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/categories').then((res) => setCategories(res.data.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.put(`/categories/${editingId}`, form);
      else await api.post('/categories', form);
      setForm({ name: '', description: '' });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', marginBottom: 20 }}>Categories</h1>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginBottom: 24, maxWidth: 420 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="field"><label>Name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="field"><label>Description</label><input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add'} category</button>
          {editingId && <button className="btn btn-secondary" type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}>Cancel</button>}
        </div>
      </form>

      <table className="card">
        <thead><tr><th>Name</th><th>Description</th><th></th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditingId(c._id); setForm({ name: c.name, description: c.description }); }}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
