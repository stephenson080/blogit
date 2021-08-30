const Category = require('../models/category')
const path = require('path')
const Post = require('../models/post')
const ReplyToComment = require('../models/replyToComment')
const Comment = require('../models/comment')
const { validationResult } = require('express-validator')
const moment = require('moment')
const { delefile, getPostById, getCommentsByPostId, getAllPosts, getCommentById, getReplyById } = require('../utils/helpers')




exports.getAddPostPage = async (req, res, next) => {
    const user = req.user
    try {
        const categories = await Category.findAll()
        const cat = []
        for (let item of categories) {
            cat.push({
                id: item.dataValues.id,
                category: item.dataValues.name
            })
        }
        res.render('dashboard/post/addposts', {
            title: 'Add Post',
            user,
            cat,
            errorMessage: '',
            errorDetails: []
        })
    } catch (error) {
        next(error)
    }

}

exports.addPost = async (req, res, next) => {
    const categories = await Category.findAll()
    const cat = []
    for (let item of categories) {
        cat.push({
            id: item.dataValues.id,
            category: item.dataValues.name
        })
    }
    const user = req.user
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed")
        error.data = errors.array()
        return res.render('dashboard/post/addposts', {
            title: 'Add Post',
            user,
            cat,
            errorMessage: error.message,
            errorDetails: error.data
        })
    }
    try {
        const { title, posttype, postbody } = req.body
        if (!req.file) {
            return res.render('dashboard/post/addposts', {
                title: 'Add Post',
                user,
                cat,
                errorMessage: 'Validation Failed',
                errorDetails: [{ msg: 'No image Uploaded' }]
            })
        }

        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        const post = await Post.create({
            head_line: title,
            body: postbody,
            categoryId: posttype,
            bloggerId: user.id,
            likes: 0,
            date_time: dateString,
            imageUrl: req.file.filename
        })
        if (post) {
            return res.render('dashboard/post/addposts', {
                title: 'Add Post',
                user,
                cat,
                errorMessage: 'Operation Successful',
                errorDetails: [{ msg: "You have Successfully added a post. Please wait for it to be approved by the admin" }]
            })
        }
        throw new Error('Something went wrong')

    } catch (error) {

        next(error)
    }


}

exports.getAllPostPage = async (req, res, next) => {

    const user = req.user
    let posts = []
    try {
        posts = await getAllPosts()
        res.render('dashboard/post/allposts', {
            title: 'All Post',
            user,
            posts,
        })
    } catch (error) {
        next(error)
    }

}
exports.deletePost = async (req, res, next) => {
    const { postId } = req.body
    try {
        const post = await Post.findByPk(postId)
        const comments = await Comment.findAll({
            where: {
                postId: postId
            }
        })
        if (post) {
            for (let comment of comments) {
                const replies = await ReplyToComment.findAll({
                    where: {
                        commentId: comment.dataValues.id
                    }
                })
                if (replies.length >= 1){
                    for (let reply of replies){
                        // delefile(reply.dataValues.imageUrl)
                        await reply.destroy()
                    }
                }
                 delefile(comment.dataValues.imageUrl)//
                await comment.destroy()
            }
            await post.destroy()
            delefile(post.dataValues.imageUrl)
            return res.json({ message: 'Post Successfully Deleted' })
        }
        return res.json({ message: 'Something went wrong' })
    } catch (error) {
        next(error)
    }
}

exports.getEditPostPage = async (req, res, next) => {
    const postId = req.params.postId
    const categories = await Category.findAll()
    const cat = []
    for (let item of categories) {
        cat.push({
            id: item.dataValues.id,
            category: item.dataValues.name
        })
    }
    const user = req.user
    const post = await getPostById(postId)
    return res.render(`dashboard/post/editpost`, {
        title: 'Edit Post',
        user,
        post,
        cat,
        errorMessage: '',
        errorDetails: []
    })
}

exports.editPost = async (req, res, next) => {
    const user = req.user
    const categories = await Category.findAll()
    const cat = []
    const { title, posttype, postbody, postId } = req.body
    const post = await getPostById(postId)


    for (let item of categories) {
        cat.push({
            id: item.dataValues.id,
            category: item.dataValues.name
        })
    }
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed")
            error.data = errors.array()
            return res.render('dashboard/post/editpost', {
                title: 'Edit Post',
                user,
                cat,
                post,
                errorMessage: error.message,
                errorDetails: error.data
            })
        }

        if (!req.file) {
            return res.render('dashboard/post/editpost', {
                title: 'Edit Post',
                user,
                cat,
                post,
                errorMessage: 'Validation Failed',
                errorDetails: [{ msg: 'No image Uploaded' }]
            })
        }

        if (!post) {
            return res.render('dashboard/post/editpost', {
                title: 'Edit Post',
                user,
                cat,
                post,
                errorMessage: 'Something went wrong',
                errorDetails: [{ msg: 'Please Try again' }]
            })
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        const upPost = await Post.update({
            title,
            imageUrl: req.file.filename,
            posttype,
            postbody,
            date_time: dateString
        }, {
            where: {
                id: postId
            }
        })
        return res.render(`dashboard/post/editpost`, {
            title: 'Add Post',
            user,
            cat,
            post,
            errorMessage: 'Operation Successful',
            errorDetails: [{ msg: "You have Successfully edited your post" }]
        })
    } catch (error) {
        next(error)
    }
}

exports.editComment = async (req, res, next) => {
    const {name, body, email, commentId} = req.body
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed")
            error.data = errors.array()
            return res.json({
                message: error.message,
                errorDetails: error.data
            })
        }
        const comment = await getCommentById(commentId)
        if (!comment.id) {
            throw new Error('Something went wrong')
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        await Comment.update({
            email,
            name,
            date_time: dateString,
            body
        },
        {
            where: {
                id: commentId
            }
        })
        const updatedComment = {
            ...comment,
            email: email,
            name: name,
            body: body,
            date: dateString
        }
        return res.json({
            message: 'Operation Successful',
            comment: updatedComment
        })
    } catch (error) {
        next(error)
    }
}

exports.editReply = async (req, res, next) => {
    const {name, body, email, commentId} = req.body
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed")
            error.data = errors.array()
            return res.json({
                message: error.message,
                errorDetails: error.data
            })
        }
        const reply = await getReplyById(commentId)
        if (!reply.id) {
            throw new Error('No record Found')
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        await ReplyToComment.update({
            name,
            email,
            body,
            date_time: dateString
        }, {
            where: {
                id: commentId
            }
        })
        const updateReply = {
            ...reply,
            email: email,
            name: name,
            body: body,
            date: dateString
        }
        res.json({
            message: 'Operation Successful',
            reply: updateReply
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteReply = async (req, res, next) => {
    const {commentId} = req.params
    try {
        const reply = await ReplyToComment.findByPk(commentId)
        if (!reply) {
            throw new Error('No record Found')
        }
        // delefile(reply.dataValues.imageUrl)
        await reply.destroy()
        res.json({
            message: 'Operation Successful'
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteComment = async (req, res, next) => {
    const {commentId} = req.params
    try {
        const comment = await Comment.findByPk(commentId)
        if (!comment) {
            throw new Error('No record Found')
        }
        
        const replies = await ReplyToComment.findAll({
            where: {
                commentId: comment.dataValues.id
            }
        })
        if (replies.length >= 1) {
            for (let reply of replies) {
                // delefile(reply.dataValues.imageUrl)
                await reply.destroy()
            }
        }
        // delefile(comment.dataValues.imageUrl)
        await comment.destroy()
        res.json({
            message: 'Operation Successful'
        })
    } catch (error) {
        next(error)
    }
}

exports.getPostDetailsPage = async (req, res, next) => {
    const user = req.user
    const postId = req.params.postId
    const post = await getPostById(postId)
    const { comments } = await getCommentsByPostId(postId)
    res.render('dashboard/post/postdetails', {
        comments,
        title: 'View Post',
        user,
        post,
    })
}
exports.getMyPostPage = async (req, res, next) => {
    const user = req.user
    let posts = []
    try {
        const fetedPosts = await Post.findAll({
            where: {
                bloggerId: req.user.id
            }
        })

        for (let post of fetedPosts) {
            const category = await Category.findByPk(post.dataValues.categoryId)
            const { noOfComments } = await getCommentsByPostId(post.dataValues.id)
            posts.push({
                id: post.dataValues.id,
                title: post.dataValues.head_line,
                category: category.dataValues.name,
                likes: post.dataValues.likes,
                date_time: post.dataValues.date_time,
                body: post.dataValues.body,
                author: 'Me',
                imageUrl: post.dataValues.imageUrl,
                noOfComments: noOfComments
            })
        }

        res.render('dashboard/post/myposts', {
            title: 'My Posts',
            user,
            posts
        })
    } catch (error) {
        next(error)
    }
}

