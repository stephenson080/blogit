const fs = require("fs")
const path = require("path")
const Post = require('../models/post')
const Author = require('../models/blogger')

exports.delefile = imageUrl =>{
    const filePath = path.join(__dirname, '..', 'images', imageUrl)
    fs.unlink(filePath, (err)=>{
        if(err){
            throw err
        }
    })
}

exports.getPostById = async (postId) => {
    let post = {}
    const fetchedPost = await Post.findByPk(postId)
    const authorname = await Author.findByPk(fetchedPost.dataValues.bloggerId)
    const author = authorname.dataValues.username
    post = {
        id: fetchedPost.dataValues.id,
        title: fetchedPost.dataValues.head_line,
        categoryId: fetchedPost.dataValues.categoryId,
        body: fetchedPost.dataValues.body,
        imageUrl: fetchedPost.dataValues.imageUrl,
        date: fetchedPost.dataValues.date_time,
        author
    }
    return post
}