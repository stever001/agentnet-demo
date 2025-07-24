// backend/models/routes/agents.js
const express = require('express');
const router = express.Router();
const { Agent } = require('../../api');
const { spawn } = require('child_process');
const path = require('path');

router.post('/', async (req, res) => {
  const { name, url, description } = req.body;

  if (!name || !url || !description) {
    return res.status(400).json({ error: 'name, url, and description are required.' });
  }

  try {
    const existing = await Agent.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Agent name already exists.' });
    }

    const newAgent = await Agent.create({ name, url, description });

    // Trigger crawl bot immediately
    const scriptPath = path.resolve(__dirname, '../../bot/runBot.js');
    const child = spawn('node', [scriptPath, newAgent.id, newAgent.url], {
      stdio: 'inherit',
    });

    res.status(201).json(newAgent);
  } catch (err) {
    console.error('Error creating agent:', err);
    res.status(500).json({ error: 'Failed to create agent.' });
  }
});

module.exports = router;
