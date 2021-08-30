const sequelize = require('../database/dbConnection')
const {DataTypes} = require('sequelize');


const Blogger = sequelize.define('blogger', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: DataTypes.STRING,
    imageUrl: DataTypes.TEXT,
    // password: DataTypes.STRING,
    role: {
        type: DataTypes.STRING,
        defaultValue: 'author'
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = Blogger