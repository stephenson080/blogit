const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("dc2lsfh782hm3f", "ucomddhlcdjqxh", "9496a84d6cabc2b25dd755ddac0eae4135cb23a46579269901d9cffc644fc041", {
    dialect: "postgres",
    host: "ec2-52-45-238-24.compute-1.amazonaws.com",
    port: "5432",
    ssl: false
})
// const {Sequelize} = require("sequelize")

// const sequelize = new Sequelize(process.env.DATABASE_URL, "postgres", "pathagoras1555", {
//     dialect: "postgres",
//     host: "localhost",
//     port: "5433"
// })
module.exports = sequelize