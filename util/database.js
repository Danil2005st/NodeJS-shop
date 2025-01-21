const Sequelize = require('sequelize');

const sequelize = new Sequelize("node-complete", "root", "00000000", {
  dialect: 'mysql',
  host: 'localhost',
})

module.exports = sequelize;