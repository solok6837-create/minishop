// orders.js — shows the logged-in user's past orders.

async function loadOrders() {
  const area = document.getElementById('ordersArea');

  if (!getToken()) {
    area.innerHTML = `<div class="empty"><div class="big">🔒</div>
      Please <a href="login.html">log in</a> to see your orders.</div>`;
    return;
  }

  const orders = await apiGet('/api/orders');

  if (!orders.length) {
    area.innerHTML = `<div class="empty"><div class="big">📦</div>
      You haven't placed any orders yet.<br><br>
      <a href="index.html" class="btn">Start Shopping</a></div>`;
    return;
  }

  area.innerHTML = orders.map(order => `
    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0;">Order #${order.orderNumber}</h3>
        <span class="badge-status">${order.status}</span>
      </div>
      <div class="order-meta">${new Date(order.createdAt).toLocaleString()}</div>
      ${order.items.map(item => `
        <div class="row">
          <div class="r-info">
            <h4>${item.name}</h4>
            <div class="muted">$${item.price.toFixed(2)} × ${item.quantity}</div>
          </div>
          <div class="line-total">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('')}
      <div class="summary-total"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
    </div>
  `).join('');
}

loadOrders();
