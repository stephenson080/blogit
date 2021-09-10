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
        type: DataTypes.STRING,
        allowNull: false
    },
    head_line: {
        type: DataTypes.STRING(50)
    },
    imageUrl: DataTypes.STRING,
    body: DataTypes.TEXT,
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    },
    bloggerId: {
        type: DataTypes.STRING,
        references: {
            model: Blogger,
            key: 'id'
        }
    },
    likes: DataTypes.INTEGER,
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = PostModel