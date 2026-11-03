const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', routes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`LabMate API running at http://localhost:${port}`);
});
