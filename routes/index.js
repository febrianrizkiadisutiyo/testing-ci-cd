const authRoutes = require('./authRoutes');
require('dotenv').config();

module.exports = (app) => {
  app.use('/', authRoutes);
};
