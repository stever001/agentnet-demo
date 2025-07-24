//backend/scripts/validateModels.js
// This script validates Sequelize models by syncing them with the database
// and checking for any discrepancies or errors.

const db = require('../models');

(async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: true }); // or { force: false }
    console.log('✅ Models are valid and synced.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sequelize model validation failed:', error);
    process.exit(1);
  }
})();
