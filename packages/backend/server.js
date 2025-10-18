// packages/backend/server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dev server listening on http://localhost:${PORT}/api/v1`);
});
