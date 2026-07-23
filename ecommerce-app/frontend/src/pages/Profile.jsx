import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await api.put('/auth/profile', form);
      setUser({ ...user, ...data.user });
      setMsg('Profile updated successfully.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    try {
      await api.put('/auth/change-password', pwForm);
      setPwMsg('Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0 70px', maxWidth: 520 }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>My profile</h1>

      <form onSubmit={saveProfile} className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Personal details</h3>
        {msg && <div className="alert alert-success">{msg}</div>}
        <div className="field"><label>Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="field"><label>Email</label><input className="input" value={user.email} disabled /></div>
        <div className="field"><label>Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <button className="btn btn-primary" type="submit">Save changes</button>
      </form>

      <form onSubmit={changePassword} className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Change password</h3>
        {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
        <div className="field"><label>Current password</label><input className="input" type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} /></div>
        <div className="field"><label>New password</label><input className="input" type="password" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} /></div>
        <button className="btn btn-primary" type="submit">Update password</button>
      </form>
    </div>
  );
}
