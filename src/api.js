// Small helper for talking to the Express API (same origin, /api/...).

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}

export async function apiGet(path) {
  const res = await fetch(path, { headers: { ...authHeader() } });
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body)
  });
  return { ok: res.ok, data: await res.json() };
}
