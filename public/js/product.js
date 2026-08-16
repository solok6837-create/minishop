// product.js — reads the product id from the web address (?id=3),
// asks the server for that product's details, and shows them.

function getIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

async function loadProduct() {
  const id = getIdFromUrl();
  const product = await apiGet('/api/products/' + id);
  const box = document.getElementById('productDetail');

  if (product.error) {
    box.innerHTML = `<div class="empty"><div class="big">🔍</div>
      Sorry, that product was not found.<br><br>
      <a href="index.html" class="btn">Back to shop</a></div>`;
    return;
  }

  box.innerHTML = `
    <div class="breadcrumb"><a href="index.html">Shop</a> / ${product.category} / ${product.name}</div>
    <div class="detail">
      <div class="image"><img src="${product.image}" alt="${product.name}" /></div>
      <div>
        <div class="cat">${product.category}</div>
        <h1>${product.name}</h1>
        <div class="price">$${product.price.toFixed(2)}</div>
        <p class="desc">${product.description}</p>
        <div class="stock">✓ In stock — ${product.stock} available</div>
        <div class="actions">
          <button class="btn" id="addBtn">🛒 Add to Cart</button>
          <a href="cart.html" class="btn btn-outline">Go to Cart</a>
          <a href="index.html" class="btn btn-light">← Keep Shopping</a>
        </div>
      </div>
    </div>`;

  document.getElementById('addBtn').addEventListener('click', (e) => {
    addToCart(product, 1);
    e.target.textContent = '✓ Added to Cart!';
  });
}

loadProduct();
