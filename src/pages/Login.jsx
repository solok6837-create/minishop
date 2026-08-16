import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const res = await apiPost(mode === 'register' ? '/api/register' : '/api/login', form);
    setBusy(false);
    if (!res.ok) { setMsg({ type: 'error', text: res.data.error || 'Something went wrong.' }); return; }
    login(res.data.token, res.data.name);
    navigate('/');
  }

  return (
    <div className="container">
      <div className="auth-card">
        <h1>Welcome to MiniShop</h1>
        <p className="muted center">Log in or create an account to check out.</p>

        <div className="tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMsg(null); }}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMsg(null); }}>Create account</button>
        </div>

        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <label className="field">Full name
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </label>
          )}
          <label className="field">Email
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </label>
          <label className="field">Password
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </label>
          <button className="btn btn-block btn-lg" disabled={busy}>
            {busy ? 'Please wait…' : (mode === 'register' ? 'Create account' : 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
}
