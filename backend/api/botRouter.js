// api/botRouter.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const Agent = require('../models/Agent');

const router = express.Router();

// POST /api/bot/rescan/:id
router.post('/rescan/:id', async (req, res) => {
  const agentId = req.params.id;

  try {
    const agent = await Agent.findByPk(agentId);
    if (!agent || !agent.url) {
      return res.status(404).json({ error: 'Agent not found or missing URL' });
    }

    const scriptPath = path.resolve(__dirname, '../../bot/runBot.js');
    const command = `node ${scriptPath} ${agent.id} ${agent.url}`;
    console.log(`🚀 Executing bot: ${command}`);

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Bot execution error: ${error.message}`);
        return res.status(500).json({ error: 'Bot failed to run' });
      }

      console.log(`📥 Bot stdout:\n${stdout}`);
      if (stderr) console.warn(`⚠️ Bot stderr:\n${stderr}`);

      // ✅ Update lastCrawledAt if bot succeeded
      try {
        agent.lastCrawledAt = new Date();
        await agent.save();
        console.log(`🕒 Updated lastCrawledAt for agent ${agent.id}`);
      } catch (updateError) {
        console.error(`❌ Failed to update lastCrawledAt: ${updateError.message}`);
      }

      return res.json({ message: 'Bot executed successfully' });
    });

  } catch (err) {
    console.error(`🔥 Server error: ${err.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
