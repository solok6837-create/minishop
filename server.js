// ============================================================
//  server.js  —  LOCAL development only.
//  It loads the shared Express app from app.js and starts it
//  on your PC. (On Vercel this file is NOT used — api/index.js
//  is the entry point instead.)
// ============================================================

const app = require('./app');
const PORT = 3000;

app.connectDB()
  .then(() => console.log('✅ Connected to MongoDB.'))
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));

app.listen(PORT, () => {
  console.log(`\n🛍️  Store is running!  Open your browser at:  http://localhost:${PORT}\n`);
});
