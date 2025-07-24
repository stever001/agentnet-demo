// backend/routes/schemas.js

const express = require('express');
const router = express.Router();
const { Schema } = require('../models');

// POST /api/schemas - Submit a JSON-LD schema
router.post('/', async (req, res) => {
  const { agentId, type, jsonLd, label } = req.body;

  // 🔍 Basic validation
  if (!agentId || !type || jsonLd === undefined || jsonLd === null) {
    return res.status(400).json({ error: 'agentId, type, and jsonLd are required.' });
  }

  if (typeof jsonLd !== 'object' || Array.isArray(jsonLd)) {
    return res.status(400).json({ error: 'jsonLd must be a valid JSON object.' });
  }

  // 🏷️ Generate label if not provided
  let generatedLabel = label;
  if (!label) {
    generatedLabel =
      jsonLd.name ||
      jsonLd.headline ||
      (Array.isArray(jsonLd['@type']) ? jsonLd['@type'][0] : jsonLd['@type']) ||
      'Untitled';
  }

  try {
    const schema = await Schema.create({
      agentId,
      type,
      jsonLd,
      label: generatedLabel,
    });

    res.status(201).json({
      message: '✅ Schema submitted successfully.',
      schema,
    });
  } catch (err) {
    console.error('❌ Error saving schema:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to save schema.' });
  }
});

// DELETE /api/schemas/:id - Delete a schema
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const schema = await Schema.findByPk(id);
    if (!schema) {
      return res.status(404).json({ error: 'Schema not found' });
    }

    await schema.destroy();
    res.json({ message: '🗑️ Schema deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting schema:', err.message);
    res.status(500).json({ error: 'Failed to delete schema.' });
  }
});

module.exports = router;
