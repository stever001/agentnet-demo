const fs = require('fs');
const path = require('path');
const sequelize = require('../db');
const Agent = require('../models/Agent');
const runBot = require('../../bot/runBot'); // assumes CommonJS export

const whitelistPath = path.join(__dirname, 'whitelist.json');
const shouldRunBot = !process.argv.includes('--no-bot');

// Delay between bot calls (in ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple retry wrapper
async function runBotWithRetry(agentId, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await runBot(agentId);
      console.log(`🔁 Bot success (attempt ${attempt})`);
      return;
    } catch (err) {
      console.warn(`⚠️  Bot failed for agentId ${agentId} (attempt ${attempt}):`, err.message);
      if (attempt < retries) await delay(500); // wait before retry
    }
  }
  console.error(`❌ Bot crawl failed after ${retries} attempts for agentId ${agentId}`);
}

const runImport = async () => {
  try {
    const raw = fs.readFileSync(whitelistPath);
    const whitelist = JSON.parse(raw);

    const top25 = whitelist
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 25);

    await sequelize.sync();

    for (const agent of top25) {
      const [record, created] = await Agent.findOrCreate({
        where: { name: agent.name },
        defaults: {
          url: agent.url,
          description: agent.description,
        }
      });

      if (created) {
        console.log(`🆕 Created: ${agent.name}`);

        if (shouldRunBot) {
          console.log(`🚀 Triggering bot for ${agent.name}...`);
          await runBotWithRetry(record.id);
          await delay(300); // throttle to avoid overloading sites
        }
      } else {
        console.log(`⚠️  Skipped (already exists): ${agent.name}`);
      }
    }

    console.log(`✅ Import complete (${shouldRunBot ? 'with' : 'without'} bot crawl)`);
  } catch (err) {
    console.error('❌ Error during import:', err);
  } finally {
    process.exit();
  }
};

runImport();
