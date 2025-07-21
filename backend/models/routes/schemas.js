// backend/routes/schemas.js

const express = require('express');
const router = express.Router();
const Schema = require('../models/Schema');

// POST /api/schemas - Submit a JSON-LD schema
router.post('/', async (req, res) => {
  const { agentId, type, jsonLd, label } = req.body;

  if (!agentId || !type || !jsonLd) {
    return res.status(400).json({ error: 'agentId, type, and jsonLd are required.' });
  }

  try {
    const schema = await Schema.create({
      agentId,
      type,
      jsonLd,
      label: label || null,
    });

    res.status(201).json({
      message: 'Schema submitted successfully.',
      schema,
    });
  } catch (err) {
    console.error('Error saving schema:', err);
    res.status(500).json({ error: 'Failed to save schema.' });
  }
});

module.exports = router;
