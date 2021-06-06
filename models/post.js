const sequelize = require('../database/dbConnection')
const {DataTypes} = require('sequelize');

const Category = require('./category')
const Blogger = require('./blogger')

const PostModel = sequelize.define('post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    date_time : {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    body: DataTypes.TEXT,
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    },
    bloggerId: {
        type: DataTypes.INTEGER,
        references: {
            model: Blogger,
            key: 'id'
        }
    }
})

module.exports = PostModel