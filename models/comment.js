const sequelize = require('../database/dbConnection')
const {DataTypes} = require('sequelize');

const Post = require('./post')

const Comment = sequelize.define('comment', {
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
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id'
        }
    }
})

module.exports = Comment