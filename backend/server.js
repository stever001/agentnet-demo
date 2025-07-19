// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Agent = require('./models/Agent');

const app = express();
app.use(cors());
app.use(express.json());

sequelize.sync().then(() => console.log('✅ Database synced'));

// Routes
app.get('/api/agents', async (req, res) => {
  const agents = await Agent.findAll();
  res.json(agents);
});

app.post('/api/agents', async (req, res) => {
  const { name, url, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  const newAgent = await Agent.create({ name, url, description });
  res.status(201).json(newAgent);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`AgentNet API listening on http://localhost:${PORT}`);
});

