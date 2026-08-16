// cart.js — shows the items in the cart, lets you change quantities,
// remove items, and place an order (checkout).

function drawCart() {
  const cart = getCart();
  const area = document.getElementById('cartArea');

  // Empty cart message
  if (cart.length === 0) {
    area.innerHTML = `<div class="empty">
      <div class="big">🛒</div>
      Your cart is empty.<br><br>
      <a href="index.html" class="btn">Start Shopping</a>
    </div>`;
    return;
  }

  // One row per item in the cart
  const rows = cart.map(item => `
    <div class="row">
      <img class="r-thumb" src="${item.image}" alt="${item.name}" />
      <div class="r-info">
        <h4>${item.name}</h4>
        <div class="muted">$${item.price.toFixed(2)} each</div>
        <button class="remove" onclick="removeItem(${item.id})">Remove</button>
      </div>
      <div class="qty">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <div class="line-total">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');

  const total = cartTotal();
  const shipping = total >= 100 ? 0 : 5;

  // Two columns: the item list, and a sticky order summary + shipping form.
  area.innerHTML = `
    <div class="layout">
      <div class="panel">${rows}</div>

      <div>
        <div class="panel">
          <h3>Order Summary</h3>
          <div class="summary-line"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
          <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$5.00'}</span></div>
          <div class="summary-total"><span>Total</span><span>$${(total + shipping).toFixed(2)}</span></div>
        </div>

        <div class="panel">
          <h3>Shipping Details</h3>
          <div id="msg"></div>
          <div class="field"><label>Full name</label><input id="shipName" placeholder="Jane Doe" /></div>
          <div class="field"><label>Address</label><input id="shipAddress" placeholder="123 Main Street" /></div>
          <div class="field"><label>City</label><input id="shipCity" placeholder="Your city" /></div>
          <button class="btn btn-block" onclick="checkout()">Place Order · $${(total + shipping).toFixed(2)}</button>
        </div>
      </div>
    </div>`;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;   // never below 1
  saveCart(cart);
  drawCart();
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
  drawCart();
}

async function checkout() {
  if (!getToken()) {
    alert('Please log in first to place your order.');
    window.location.href = 'login.html';
    return;
  }

  const shipping = {
    name: document.getElementById('shipName').value,
    address: document.getElementById('shipAddress').value,
    city: document.getElementById('shipCity').value
  };
  if (!shipping.name || !shipping.address || !shipping.city) {
    return showMsg('Please fill in all shipping fields.', 'error');
  }

  // Send only id + quantity — the server looks up the real prices.
  const items = getCart().map(i => ({ id: i.id, quantity: i.quantity }));
  const result = await apiPost('/api/orders', { items, shipping });

  if (!result.ok) return showMsg(result.data.error || 'Something went wrong.', 'error');

  saveCart([]);
  alert('🎉 Order placed successfully! Order #' + result.data.orderNumber);
  window.location.href = 'orders.html';
}

function showMsg(text, type) {
  document.getElementById('msg').innerHTML = `<div class="msg ${type}">${text}</div>`;
}

drawCart();
