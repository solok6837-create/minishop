// index.js — loads all products and draws them as cards on the home page.

async function loadProducts() {
  const products = await apiGet('/api/products');
  const grid = document.getElementById('productGrid');
  document.getElementById('productCount').textContent = products.length + ' items';

  grid.innerHTML = products.map(p => `
    <div class="card">
      <a href="product.html?id=${p.id}" class="thumb">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </a>
      <div class="body">
        <div class="cat">${p.category}</div>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <button class="btn btn-block" onclick='addAndNotify(${JSON.stringify(p)}, this)'>Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Adds the product to the cart and briefly changes the button text.
function addAndNotify(product, btn) {
  addToCart(product, 1);
  btn.textContent = '✓ Added!';
  setTimeout(() => { btn.textContent = 'Add to Cart'; }, 900);
}

loadProducts();
