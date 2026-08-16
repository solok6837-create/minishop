// ============================================================
//  app.js  —  The Express app (shared by local dev AND Vercel).
//  It does NOT call app.listen() here — that happens in
//  server.js for local use. On Vercel, api/index.js exports it.
//
//  Cloud-ready changes vs the original:
//    * MongoDB connection is CACHED (serverless calls run often)
//    * Login uses stateless JWT tokens (no server memory needed)
//    * Database address & secret come from environment variables
// ============================================================

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

// --- Settings (read from environment on Vercel, with local fallbacks) ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/minishop';
const JWT_SECRET  = process.env.JWT_SECRET  || 'local-dev-secret-change-me';

// ------------------------------------------------------------
//  DATABASE SHAPES ("schemas")
// ------------------------------------------------------------
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  id: Number, name: String, price: Number, image: String,
  category: String, description: String, stock: Number
}));

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  salt: String,
  passwordHash: String
}));

const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  orderNumber: Number,
  userId: mongoose.Schema.Types.ObjectId,
  items: [{ id: Number, name: String, price: Number, quantity: Number }],
  total: Number,
  shipping: Object,
  status: String,
  createdAt: { type: Date, default: Date.now }
}));

const STARTER_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 59.99,  image: '/images/headphones.jpg', category: 'Audio',
    description: 'Comfortable over-ear headphones with deep bass and 30-hour battery life.', stock: 12 },
  { id: 2, name: 'Smart Watch',         price: 129.00, image: '/images/watch.jpg',      category: 'Wearables',
    description: 'Track your steps, heart rate and sleep. Water resistant up to 50m.', stock: 8 },
  { id: 3, name: 'Mechanical Keyboard', price: 89.50,  image: '/images/keyboard.jpg',   category: 'Accessories',
    description: 'Tactile mechanical switches with a clean minimalist design.', stock: 20 },
  { id: 4, name: 'Wireless Mouse',      price: 24.99,  image: '/images/mouse.jpg',      category: 'Accessories',
    description: 'Ergonomic silent-click mouse with a rechargeable battery.', stock: 35 },
  { id: 5, name: 'Bluetooth Speaker',   price: 45.00,  image: '/images/speaker.jpg',    category: 'Audio',
    description: 'Portable waterproof speaker with 360 degree sound and 12-hour playtime.', stock: 18 },
  { id: 6, name: 'Wireless Earbuds',    price: 79.99,  image: '/images/earbuds.jpg',    category: 'Audio',
    description: 'True wireless earbuds with active noise cancellation and a charging case.', stock: 25 },
  { id: 7, name: 'DSLR Camera',         price: 549.00, image: '/images/camera.jpg',     category: 'Photography',
    description: '24MP DSLR camera with 18-55mm lens, Full HD video and Wi-Fi sharing.', stock: 6 },
  { id: 8, name: 'Laptop 14"',          price: 899.00, image: '/images/laptop.jpg',     category: 'Computers',
    description: 'Slim 14-inch laptop with a fast processor, 16GB RAM and all-day battery.', stock: 5 }
];

// ------------------------------------------------------------
//  DATABASE CONNECTION (cached so serverless doesn't reconnect
//  on every single request) + one-time product seeding.
// ------------------------------------------------------------
let connPromise = null;
let seeded = false;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;        // already connected
  if (!connPromise) connPromise = mongoose.connect(MONGODB_URI);
  await connPromise;
}

async function ensureSeeded() {
  if (seeded) return;
  if (await Product.countDocuments() === 0) {
    await Product.insertMany(STARTER_PRODUCTS);
  }
  seeded = true;
}

// ------------------------------------------------------------
//  PASSWORD + TOKEN HELPERS
// ------------------------------------------------------------
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}
function makeToken(user) {
  // A signed JWT holds the user id. No server-side memory needed.
  return jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
}
async function getUserFromRequest(req) {
  const token = (req.headers['authorization'] || '').replace('Bearer ', '');
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return await User.findById(payload.userId);
  } catch {
    return null;   // invalid or expired token
  }
}

// ------------------------------------------------------------
//  MIDDLEWARE
// ------------------------------------------------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));   // used locally; on Vercel a CDN serves these

// Make sure the database is connected before any /api request.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    await ensureSeeded();
    next();
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: 'Could not reach the database.' });
  }
});

// ============================================================
//  API ROUTES
// ============================================================
app.get('/api/products', async (req, res) => {
  res.json(await Product.find().sort({ id: 1 }));
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findOne({ id: Number(req.params.id) });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please fill in name, email and password.' });
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    return res.status(400).json({ error: 'An account with that email already exists.' });
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const user = await User.create({
    name, email: email.toLowerCase(), salt, passwordHash: hashPassword(password, salt)
  });
  res.json({ token: makeToken(user), name: user.name });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || user.passwordHash !== hashPassword(password || '', user.salt)) {
    return res.status(401).json({ error: 'Wrong email or password.' });
  }
  res.json({ token: makeToken(user), name: user.name });
});

app.post('/api/orders', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Please log in before checking out.' });

  const { items, shipping } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'Your cart is empty.' });

  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findOne({ id: Number(item.id) });
    if (!product) return res.status(400).json({ error: `Product ${item.id} not found.` });
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough "${product.name}" in stock.` });
    }
    total += product.price * item.quantity;
    orderItems.push({ id: product.id, name: product.name, price: product.price, quantity: item.quantity });
  }
  for (const item of items) {
    await Product.updateOne({ id: Number(item.id) }, { $inc: { stock: -item.quantity } });
  }

  const orderNumber = (await Order.countDocuments()) + 1;
  const order = await Order.create({
    orderNumber, userId: user._id, items: orderItems,
    total: Math.round(total * 100) / 100, shipping: shipping || {}, status: 'Confirmed'
  });
  res.json(order);
});

app.get('/api/orders', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Please log in to see your orders.' });
  res.json(await Order.find({ userId: user._id }).sort({ createdAt: -1 }));
});

module.exports = app;
module.exports.connectDB = connectDB;   // handy for local startup
