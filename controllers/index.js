// const Category = require('../models/category')
const Author = require('../models/blogger')
const Comment = require('../utils/comment')
const Reply = require('../utils/reply')
const moment = require('moment')
const Post = require('../utils/post')
const User = require('../utils/user')
const Category = require('../utils/category')
const { getHotPosts, getPostById, getCommentsByPostId, getCommentById } = require('../utils/helpers')
const { validationResult } = require('express-validator')

const homePageImages = [{
    name: 'Progromming',
    image: 'program.jpg'
},
{
    name: 'Photography',
    image: 'photo.jpg'
},
{
    name: 'Music',
    image: 'music.jpg'
},
{
    name: 'Technology',
    image: 'tech.jpg'
},
{
    name: 'Travel',
    image: 'travel.jpg'
},
{
    name: 'Sport',
    image: 'sport.jpg'
}
]
exports.getIndexOrDashBoardPage = async (req, res, next, isAuthenticated, user) => {
    const posts = await Post.getAllPosts()
    const users = await User.getUsers()
    const cat = await Category.getAllCategories()
    const hotPosts = getHotPosts(posts)
    if (isAuthenticated) {
        try {
            const fetchedUser = await User.getUserById(user.sub)
            if (fetchedUser.id) {
                if (fetchedUser.role == 'author') {
                    return res.render('dashboard/index', {
                        title: 'Dashboard',
                        user: fetchedUser,
                        hotPosts
                    })
                }
                return res.render('admin/index', {
                    title: 'Admin Dashboard',
                    user: fetchedUser,
                    hotPosts,
                    posts,
                    users
                })
            }
            const newUser = await User.addnewUser(user)
            if (newUser.role == 'author') {
                return res.render('dashboard/index', {
                    title: 'Dashboard',
                    user: newUser,
                    hotPosts
                })
            }
            return res.render('admin/index', {
                title: 'Admin Dashboard',
                user: newUser,
                hotPosts,
                users,
                posts,
            })
        } catch (error) {
            next(error)
        }
    }
    console.log(hotPosts, 'fkfklfk')
    return res.render('index', {
        title: "BLOGit Home",
        cat : cat,
        posts,
        user: req.user,
        hotPosts,
        homePageImages
    })
    
}

exports.veiwPost = async (req, res, next) => {
    const postId = req.params.postId
    try {
        const cat = await Category.getAllCategories()
        const post = await Post.getPostById(postId)
        const comments = await Comment.getAllCommentsByPostId(postId)
        return res.render('view-post', {
            title: "View Post",
            cat,
            user: req.user,
            post,
            comments: comments
        })
    } catch (error) {
        next(error)
    }

}

exports.replyComment = async (req, res, next) => {
    const { name, email, body, commentId } = req.body
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
        const comment = await Comment.getCommentById(commentId)
        if (!comment.id) {
            return res.json({ message: 'No Comment Found' })
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        const newReply = await Reply.addNewReply(name, email, dateString, body, comment.id, '')
        if (!newReply.name) {
            throw new Error('Semthing went wrong')
        }
        res.json({
            message: 'Operation Successful',
            reply: newReply
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}
exports.addComment = async (req, res, next) => {
    try {
        const { name, body, email, postId } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed")
            error.data = errors.array()
            return res.json({
                message: error.message,
                errorDetails: error.data
            })
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        const comment = await Comment.addNewComment(name, email, dateString, postId, body, '')
        if (!comment) {
            throw new Error('Semthing went wrong')
        }
        return res.json({
            message: 'Operation Successful',
            comment: comment
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.get505ErrorPage = async (req, res) => {
    const cat = await Category.getAllCategories()
    return res.render('error', {
        title: "Error",
        cat,
        user: req.user
    })
}

exports.get404Page  = async (req, res, next) => {
    try {
        const cat = await Category.getAllCategories()
        return res.render('404page', {
            user: req.user,
            title: 'Page not found',
            cat
        })
    } catch (error) {
        next(error)
    }
    
}