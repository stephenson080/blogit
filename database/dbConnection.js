const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("blogit", "postgres", "pathagoras1555", {
    dialect: "postgres",
    host: "localhost",
    port: "5433"
})

module.exports = sequelize