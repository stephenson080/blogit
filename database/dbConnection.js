const {Sequelize} = require("sequelize")

const sequelize = new Sequelize(`postgres://ucomddhlcdjqxh:9496a84d6cabc2b25dd755ddac0eae4135cb23a46579269901d9cffc644fc041@ec2-52-45-238-24.compute-1.amazonaws.com:5432/dc2lsfh782hm3f?sslmode=require`, {
    dialect: "postgres",
    logging: false,
    url: `postgres://ucomddhlcdjqxh:9496a84d6cabc2b25dd755ddac0eae4135cb23a46579269901d9cffc644fc041@ec2-52-45-238-24.compute-1.amazonaws.com:5432/dc2lsfh782hm3f`,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})
// const {Sequelize} = require("sequelize")

// const sequelize = new Sequelize(process.env.DATABASE_URL, "postgres", "pathagoras1555", {
//     dialect: "postgres",
//     host: "localhost",
//     port: "5433"
// })
module.exports = sequelize