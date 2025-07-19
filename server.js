// server.js
const express = require('express');
const cors = require('cors');
const publishedAgents = [];
const agents = [
  { id: 1, name: "MarketBot", description: "Analyzes product trends." },
  { id: 2, name: "ContentCurator", description: "Selects high-performing content." },
];
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/agents', (req, res) => {
  res.json(agents);
});

app.get('/api/nodes', (req, res) => {
  res.json(publishedAgents);
});

app.post('/api/publish', (req, res) => {
  const agent = req.body;
  publishedAgents.push(agent);
  res.status(200).json({ message: 'Agent published' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
