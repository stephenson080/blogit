const {connectDb} = require('../database/dbConnection')
const {DataTypes} = require('sequelize');

const Post = require('./post')

const sequelize = connectDb()

const Comment = sequelize.define('comment', {
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
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id'
        }
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    imageUrl: DataTypes.STRING
})

module.exports = Comment