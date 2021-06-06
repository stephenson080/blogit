const sequelize = require('../database/dbConnection')
const {DataTypes} = require('sequelize');


const Blogger = sequelize.define('blogger', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: DataTypes.STRING(20),
    imageUrl: DataTypes.STRING,
    password: DataTypes.STRING,
})

module.exports = Blogger