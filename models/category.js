const {connectDb} = require('../database/dbConnection')
const {DataTypes} = require('sequelize')

const sequelize = connectDb()

const CategoryModel = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    imageUrl: DataTypes.STRING
})

module.exports = CategoryModel