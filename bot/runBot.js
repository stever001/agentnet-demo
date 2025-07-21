// backend/bot/runBot.js
const axios = require('axios');
const cheerio = require('cheerio');
const { Schema, Agent } = require('../models');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const [,, agentId, targetUrl] = process.argv;

if (!agentId || !targetUrl) {
  console.error('❌ Usage: node runBot.js <agentId> <url>');
  process.exit(1);
}

(async () => {
  console.log(`🔍 Crawling ${targetUrl}...`);
  let response;
  try {
    response = await axios.get(targetUrl);
  } catch (err) {
    console.error('❌ Failed to fetch URL:', err.message);
    process.exit(1);
  }

  const $ = cheerio.load(response.data);
  const scripts = $('script[type="application/ld+json"]');
  if (!scripts.length) {
    console.error('❌ No JSON-LD found at URL');
    process.exit(1);
  }

  const extractedSchemas = [];
  scripts.each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      const entries = Array.isArray(json) ? json : [json];

      entries.forEach(entry => {
        if (entry['@type']) {
          extractedSchemas.push({
            type: entry['@type'],
            label: entry.name || entry.headline || entry['@type'],
            jsonLd: entry
          });
        }
      });
    } catch (err) {
      console.warn(`⚠️ Skipping invalid JSON-LD block [${i}]: ${err.message}`);
    }
  });

  if (!extractedSchemas.length) {
    console.error('❌ No usable JSON-LD entries found.');
    process.exit(1);
  }

  // Use transaction to ensure atomic replacement
  const transaction = await Schema.sequelize.transaction();

  try {
    // Delete existing schemas
    await Schema.destroy({ where: { agentId }, transaction });

    // Save new schemas
    for (const schema of extractedSchemas) {
      await Schema.create({
        agentId,
        type: Array.isArray(schema.type) ? schema.type.join(',') : schema.type,
        jsonLd: schema.jsonLd,
        label: schema.label
      }, { transaction });

      console.log(`✅ Submitted schema: ${schema.label}`);
    }

    // Update agent timestamp
    await Agent.update(
      { lastCrawledAt: Sequelize.literal('CURRENT_TIMESTAMP') },
      { where: { id: agentId }, transaction }
    );

    await transaction.commit();
    console.log(`🕒 Updated lastCrawledAt for agent ${agentId}`);
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Failed to store schemas:', err.message);
    process.exit(1);
  }
})();
