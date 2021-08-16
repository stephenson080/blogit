const fs = require("fs")
const path = require("path")
const Post = require('../models/post')
const Author = require('../models/blogger')
const Comment = require('../models/comment')
const Category = require('../models/category')
const replyToComment = require('../models/replyToComment')

exports.delefile = imageUrl => {
    const filePath = path.join(__dirname, '..', 'images', imageUrl)
    fs.unlink(filePath, (err) => {
        if (err) {
            throw err
        }
    })
}

exports.getPostById = async (postId) => {
    let post = {}
    const fetchedPost = await Post.findByPk(postId)
    const authorname = await Author.findByPk(fetchedPost.dataValues.bloggerId)
    const category = await Category.findByPk(fetchedPost.dataValues.categoryId)
    const author = authorname.dataValues.username
    const commentsCount = await Comment.findAndCountAll({
        where: {
            postId: postId
        }
    })
    post = {
        id: fetchedPost.dataValues.id,
        title: fetchedPost.dataValues.head_line,
        likes: fetchedPost.dataValues.likes,
        category: category.dataValues.name,
        body: fetchedPost.dataValues.body,
        imageUrl: fetchedPost.dataValues.imageUrl,
        date: fetchedPost.dataValues.date_time,
        author,
        noOfComments: commentsCount.count,
        authorId: fetchedPost.dataValues.bloggerId
    }
    return post
}

exports.getAllPosts = async () => {
    let posts = []
    try {
        const fetchedPosts = await Post.findAll()
        for (let post of fetchedPosts) {
            const authorname = await Author.findByPk(post.dataValues.bloggerId)
            const author = authorname.dataValues.username
            const category = await Category.findByPk(post.dataValues.categoryId)
            const commentsCount = await Comment.findAndCountAll({
                where: {
                    postId: post.dataValues.id
                }
            })
            posts.push({
                id: post.dataValues.id,
                likes: post.dataValues.likes,
                title: post.dataValues.head_line,
                category: category.dataValues.name,
                body: post.dataValues.body,
                imageUrl: post.dataValues.imageUrl,
                date: post.dataValues.date_time,
                author,
                noOfComments: commentsCount.count,
                authorId: post.dataValues.bloggerId
            })
        }
        return posts
    } catch (error) {
        throw error
    }

}

exports.getCommentsByPostId = async (postId) => {
    try {
        let comments = []
        const fetctedComments = await Comment.findAndCountAll({
            where: {
                postId: postId
            }
        })
        for (let comment of fetctedComments.rows) {
            const fetchedReplies = await replyToComment.findAll({
                where: {
                    commentId: comment.dataValues.id
                }
            })
            let replies = []
            if (fetchedReplies.length >= 1) {
                for (let reply of fetchedReplies) {
                    replies.push({
                        name: reply.dataValues.name,
                        id: reply.dataValues.id,
                        body: reply.dataValues.body,
                        imageUrl: reply.dataValues.imageUrl,
                        date: reply.dataValues.date_time,
                        email: reply.dataValues.email
                    })
                    
                }
                
            }
            comments.push({
                id: comment.dataValues.id,
                name: comment.dataValues.name,
                imageUrl: comment.dataValues.imageUrl,
                body: comment.dataValues.body,
                date: comment.dataValues.date_time,
                email: comment.dataValues.email,
                postId: comment.dataValues.postId,
                replies: replies
            })
           
        }
        return {
            comments,
            noOfComments: fetctedComments.count
        }
    } catch (error) {
        throw error
    }
}

exports.getCommentById = async (commentId) => {
    let comment = {}
    let replies = []
    try {
        const fetchedComment = await Comment.findByPk(commentId)
        if (!fetchedComment) {
            return {}
        }
        
        const fetchedReplies = await replyToComment.findAll({
            where: {
                commentId: fetchedComment.dataValues.id
            }
        })
        if (fetchedReplies.length >= 1) {
            for (let reply of fetchedReplies) {
                replies.push({
                    name: reply.dataValues.name,
                    id: reply.dataValues.id,
                    body: reply.dataValues.body,
                    imageUrl: reply.dataValues.imageUrl,
                    date: reply.dataValues.date_time,
                    email: reply.dataValues.email
                })
            }
        }
        comment = {
            id: fetchedComment.dataValues.id,
            name: fetchedComment.dataValues.name,
            imageUrl: fetchedComment.dataValues.imageUrl,
            body: fetchedComment.dataValues.body,
            date: fetchedComment.dataValues.date_time,
            email: fetchedComment.dataValues.email,
            postId: fetchedComment.dataValues.postId,
            replies: replies
        }
        return comment
    } catch (error) {
        throw error
    }
}