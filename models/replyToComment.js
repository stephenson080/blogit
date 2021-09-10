const sequelize = require('../database/dbConnection')
const {DataTypes} = require('sequelize');

const Comment = require('./comment')

const ReplyToComment = sequelize.define('reply-to-comment', {
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
    body: DataTypes.TEXT,
    commentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Comment,
            key: 'id'
        }
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    imageUrl: DataTypes.STRING
})

module.exports = ReplyToComment