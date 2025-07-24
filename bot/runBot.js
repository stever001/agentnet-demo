// runBot.js
// bot/runBot.js
const axios = require('axios');
const cheerio = require('cheerio');
const { Agent, Schema } = require('../backend/models');
const sequelize = require('../backend/db');
const extractJsonLd = require('./fetchJsonLd');

async function runBot(agentId, url) {
  console.log(`🔁 Triggering bot crawl for ${agentId} → ${url}`);

  const agent = await Agent.findByPk(agentId);
  if (!agent) throw new Error(`Agent with ID ${agentId} not found`);

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // 🧠 Await the extraction — must resolve before we iterate
    const jsonLds = await extractJsonLd($);

    if (!Array.isArray(jsonLds)) {
      console.error(`❌ JSON-LD extraction returned non-array:`, jsonLds);
      await Agent.update(
        {
          status: 'error',
          lastCrawledAt: new Date(),
          crawlError: 'Invalid JSON-LD format returned'
        },
        { where: { id: agentId } }
      );
      return;
    }

    if (jsonLds.length === 0) {
      console.warn(`❌ No JSON-LD <script> blocks found at ${url}`);
      await Agent.update(
        {
          status: 'no-data',
          lastCrawledAt: new Date(),
          crawlError: 'No JSON-LD found'
        },
        { where: { id: agentId } }
      );
      return;
    }

    const transaction = await sequelize.transaction();
    try {
      await Schema.destroy({ where: { agentId }, transaction });

      for (const raw of jsonLds) {
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        await Schema.create({ agentId, type: data['@type'] || 'Unknown', data }, { transaction });
      }

      await transaction.commit();

      await Agent.update(
        {
          status: 'active',
          lastCrawledAt: new Date(),
          crawlError: null
        },
        { where: { id: agentId } }
      );

      console.log(`✅ Stored ${jsonLds.length} schemas for ${agent.name}`);
    } catch (err) {
      await transaction.rollback();
      console.error(`❌ Failed to store schemas for agent ${agentId}:`, err);
      throw err;
    }
  } catch (err) {
    const message = err.message || 'Unknown error';
    console.error(`❌ Unexpected error during crawl: ${message}`);

    await Agent.update(
      {
        status: 'error',
        lastCrawledAt: new Date(),
        crawlError: message
      },
      { where: { id: agentId } }
    );

    throw err;
  }
}

// CLI support
if (require.main === module) {
  const [,, agentId, url] = process.argv;
  if (!agentId || !url) {
    console.error('❌ Usage: node runBot.js <agentId> <url>');
    process.exit(1);
  }

  runBot(agentId, url)
    .then(() => {
      console.log('✅ Bot run complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Bot run failed:', err);
      process.exit(1);
    });
}

module.exports = runBot;
