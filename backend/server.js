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
//sequelize.sync({ force: true }).then(() => console.log('⚠️ All tables dropped and recreated.'));

// ✅ Tip: Use this only when you want to rebuild your schema from scratch (e.g. after model changes).
//In production, use Sequelize migrations instead.

app.use('/api/bot', botRouter); // ✅ Use bot router

// Get all agents
app.get('/api/agents', async (req, res) => {
  const agents = await Agent.findAll();
  res.json(agents);
});

// Create new agent and trigger crawl
const { spawn } = require('child_process');
const path = require('path');

app.post('/api/agents', async (req, res) => {
  const { name, url, description } = req.body;

  if (!name || !url || !description) {
    return res.status(400).json({ error: 'name, url, and description are required.' });
  }

  try {
    // Prevent duplicate agent names
    const existing = await Agent.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Agent name already exists.' });
    }

    const newAgent = await Agent.create({ name, url, description });

    // 🔄 Trigger the crawl bot script
    const scriptPath = path.resolve(__dirname, './bot/runBot.js');
    const child = spawn('node', [scriptPath, newAgent.id, newAgent.url], {
      stdio: 'inherit',
    });

    res.status(201).json(newAgent);
  } catch (err) {
    console.error('❌ Error creating agent:', err);
    res.status(500).json({ error: 'Failed to create agent.' });
  }
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
app.post('/api/agents/:id/deactivate', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const agent = await Agent.findByPk(id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    agent.status = 'inactive';
    agent.deactivatedAt = new Date();
    agent.deactivationReason = reason || 'Unspecified';
    await agent.save();

    res.json({ message: 'Agent deactivated.', agent });
  } catch (err) {
    console.error('Error deactivating agent:', err);
    res.status(500).json({ error: 'Failed to deactivate agent.' });
  }
});

app.post('/api/agents/:id/reactivate', async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await Agent.findByPk(id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    agent.status = 'active';
    agent.deactivatedAt = null;
    agent.deactivationReason = null;
    await agent.save();

    res.json({ message: 'Agent reactivated.', agent });
  } catch (err) {
    console.error('Error reactivating agent:', err);
    res.status(500).json({ error: 'Failed to reactivate agent.' });
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

