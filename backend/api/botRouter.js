// api/botRouter.js
const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const { spawn } = require('child_process');
const path = require('path');

router.post('/rescan/:agentId', async (req, res) => {
  const agentId = req.params.agentId;

  try {
    const agent = await Agent.findByPk(agentId);
    if (!agent) {
      console.error('❌ Agent not found for rescan:', agentId);
      return res.status(404).json({ error: 'Agent not found' });
    }

    console.log(`🔁 Triggering bot crawl for ${agent.name} → ${agent.url}`);

    const scriptPath = path.resolve(__dirname, '../../bot/runBot.js');
    const child = spawn('node', [scriptPath, agent.id, agent.url], {
      stdio: 'inherit' // 👈 log to server terminal
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Bot finished successfully for ${agent.name}`);
        res.status(200).json({ message: 'Bot completed.' });
      } else {
        console.error(`❌ Bot process failed with code ${code} for ${agent.name}`);
        res.status(500).json({ error: `Bot failed with code ${code}` });
      }
    });

  } catch (err) {
    console.error('❌ Unexpected error in botRouter:', err);
    res.status(500).json({ error: 'Unexpected server error', details: err.message });
  }
});

module.exports = router;
