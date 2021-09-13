const {Sequelize} = require("sequelize")

const sequelize = new Sequelize(process.env.DATBASE_URL)
module.exports = sequelize