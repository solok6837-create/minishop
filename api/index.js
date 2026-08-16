// Vercel serverless entry point.
// Vercel runs this file for every /api/* request. It simply
// hands the request to our shared Express app.
module.exports = require('../app');
