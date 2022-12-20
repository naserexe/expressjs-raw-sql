const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log(process.env.DB_URI);
const sequelize = new Sequelize(process.env.DB_URI);

try {
  sequelize.authenticate();
  console.log('Database connected successfully');
} catch (error) {
  console.error('Failed to connect database', error);
}
module.exports = sequelize;