// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Agent = require('./models/Agent');
const Schema = require('./models/Schema'); // ✅ import Schema model
const botRouter = require('./api/botRouter');

const app = express();
app.use(cors());
app.use(express.json());

sequelize.sync().then(() => console.log('✅ Database synced'));
app.use('/api/bot', botRouter); // ✅ Use bot router

// Get all agents
app.get('/api/agents', async (req, res) => {
  const agents = await Agent.findAll();
  res.json(agents);
});

// Create new agent
app.post('/api/agents', async (req, res) => {
  const { name, url, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  const newAgent = await Agent.create({ name, url, description });
  res.status(201).json(newAgent);
});

// Get a single agent and its schemas
app.get('/api/agents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const agent = await Agent.findByPk(id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const schemas = await Schema.findAll({ where: { agentId: id } });

    res.json({ agent, schemas });
  } catch (err) {
    console.error('Error fetching agent:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Submit a JSON-LD schema
app.post('/api/schemas', async (req, res) => {
  const { agentId, type, jsonLd, label } = req.body;

  if (!agentId || !type || !jsonLd) {
    return res.status(400).json({ error: 'agentId, type, and jsonLd are required' });
  }

  try {
    const newSchema = await Schema.create({ agentId, type, jsonLd, label });
    res.status(201).json(newSchema);
  } catch (err) {
    console.error('Error saving schema:', err);
    res.status(500).json({ error: 'Failed to save schema' });
  }
});

// Delete a schema by ID
app.delete('/api/schemas/:id', async (req, res) => {
  try {
    const schema = await Schema.findByPk(req.params.id);
    if (!schema) return res.status(404).json({ error: 'Schema not found' });

    await schema.destroy();
    res.json({ message: 'Schema deleted' });
  } catch (err) {
    console.error('Error deleting schema:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`AgentNet API listening on http://localhost:${PORT}`);
});

