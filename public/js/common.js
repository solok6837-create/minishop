// ============================================================
//  common.js — shared helpers used by every page.
//  Handles: the shopping cart, login state, and the top menu.
//  The cart & login token are saved in the browser's
//  "localStorage" so they survive page refreshes.
// ============================================================

// ---------- SHOPPING CART (stored in the browser) ----------
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity });
  }
  saveCart(cart);
}
function cartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}
function cartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ---------- LOGIN STATE ----------
function getToken() { return localStorage.getItem('token'); }
function getUserName() { return localStorage.getItem('userName'); }
function setAuth(token, name) {
  localStorage.setItem('token', token);
  localStorage.setItem('userName', name);
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = 'index.html';
}

// ---------- TALKING TO THE SERVER (the API) ----------
async function apiGet(url) {
  const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + getToken() } });
  return res.json();
}
async function apiPost(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
    body: JSON.stringify(data)
  });
  return { ok: res.ok, data: await res.json() };
}

// ---------- THE TOP MENU (navigation bar) ----------
function renderHeader() {
  const loggedIn = !!getToken();
  const accountLink = loggedIn
    ? `<a href="orders.html">My Orders</a>
       <a href="#" onclick="logout(); return false;">Logout (${getUserName()})</a>`
    : `<a href="login.html">Login</a>`;

  document.getElementById('header').innerHTML = `
    <header><div class="container nav">
      <a href="index.html" class="logo">Mini<span>Shop</span></a>
      <nav class="nav-links">
        <a href="index.html">Shop</a>
        ${accountLink}
        <a href="cart.html" class="cart-link">🛒 Cart <span class="cart-badge" id="cartBadge">0</span></a>
      </nav>
    </div></header>`;
  updateCartBadge();
  renderFooter();
}
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = cartCount();
}

// ---------- THE FOOTER (added to the bottom of every page) ----------
function renderFooter() {
  if (document.getElementById('siteFooter')) return;   // don't add twice
  const footer = document.createElement('footer');
  footer.id = 'siteFooter';
  footer.innerHTML = `
    <div class="container">
      <div class="logo">Mini<span style="color:var(--primary)">Shop</span></div>
      <div>© ${new Date().getFullYear()} MiniShop · Built with Express &amp; MongoDB</div>
    </div>`;
  document.body.appendChild(footer);
}

// Draw the header as soon as the page loads.
document.addEventListener('DOMContentLoaded', renderHeader);
