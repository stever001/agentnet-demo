const sequelize = require('../db');
const { Agent } = require('../models/index.js');
const runBot = require('../../bot/runBot');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const MAX_RETRIES = 2;

async function runBotWithRetry(agent, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🚀 Attempt ${attempt} for ${agent.name}...`);
      await runBot(agent.id, agent.url);
      console.log(`✅ Success: ${agent.name}`);
      return;
    } catch (err) {
      console.warn(`⚠️  Retry ${attempt} failed for ${agent.name}: ${err.message}`);
      if (attempt < retries) await delay(500);
    }
  }

  console.error(`❌ Bot crawl failed after ${retries} retries for ${agent.name}`);
}

async function retryFailedAgents() {
  try {
    await sequelize.sync();

    const agents = await Agent.findAll({
      where: {
        status: ['error', 'no-data']
      }
    });

    if (agents.length === 0) {
      console.log('✅ No failed agents to retry.');
      return;
    }

    console.log(`🔁 Retrying ${agents.length} failed agent(s)...`);

    for (const agent of agents) {
      console.log(`---\n🔍 Re-crawling: ${agent.name} (${agent.url})`);
      await runBotWithRetry(agent, MAX_RETRIES);
      await delay(300); // avoid hammering
    }

    console.log('✅ Re-crawl complete.');
  } catch (err) {
    console.error('❌ Unexpected error during re-crawl:', err);
  } finally {
    process.exit();
  }
}

retryFailedAgents();
