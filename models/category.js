const sequelize = require('../database/dbConnection')
const {DataTypes} = require('sequelize')

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
    }
})

module.exports = CategoryModel