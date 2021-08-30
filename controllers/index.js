const Category = require('../models/category')
const Author = require('../models/blogger')
const Comment = require('../models/comment')
const ReplyToComment = require('../models/replyToComment')
const moment = require('moment')
const {getAllPosts, getPostById, getCommentsByPostId, getCommentById} = require('../utils/helpers')
const {validationResult} = require('express-validator')

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
    let fetchedUser = {}
    const posts = await getAllPosts()
    const categories = await Category.findAll()
    const cat = []
    for (let item of categories) {
        cat.push({
            id: item.dataValues.id,
            category: item.dataValues.name
        })
    }
    if (isAuthenticated) {
        try {
            const author = await Author.findAll({
                where: {
                    id: user.sub 
                }
            })            
            if (author[0]) {
                fetchedUser = {
                    id: author[0].sub,
                    email: author[0].email,
                    username: author[0].username,
                    imageUrl: author[0].picture,
                    role: author[0].role
                }
                if (fetchedUser.role == 'author') {
                    return res.render('dashboard/index', {
                        title: 'Dashboard',
                        user: fetchedUser
                    })
                }
                return res.render('admin/index', {
                    title: 'Admin Dashboard',
                    user: fetchedUser
                })
            }
            const newAuthor = await Author.create({
                id: user.sub,
                email: user.email ? user.email : '',
                imageUrl: user.picture,
                username: user.nickname,
            })
            console.log('new Author', newAuthor)
            fetchedUser = {
                email: newAuthor.dataValues.email,
                username: newAuthor.dataValues.username,
                imageUrl: newAuthor.dataValues.imageUrl,
                role: newAuthor.dataValues.role
            }
            if (fetchedUser.role == 'author') {
                return res.render('dashboard/index', {
                    title: 'Dashboard',
                    user: fetchedUser
                })
            }
            return res.render('admin/index', {
                title: 'Admin Dashboard',
                user: fetchedUser
            })
        } catch (error) {
            next(error)
        }
    }
    res.render('index', {
        title: "BLOGit Home",
        cat,
        user: req.user,
        posts,
        homePageImages
    })
}

exports.veiwPost = async (req, res, next) => {
    const categories = await Category.findAll()
    const postId = req.params.postId
    const cat = []
    try {
        for (let item of categories) {
            cat.push({
                id: item.dataValues.id,
                category: item.dataValues.name
            })
        }
        const post = await getPostById(postId)
        const commentsData = await getCommentsByPostId(postId)
        res.render('view-post', {
            title: "View Post",
            cat,
            user: req.user,
            post,
            comments: commentsData.comments
        })
    } catch (error) {
        next(error)
    }
    
}

exports.replyComment = async (req, res, next) => {
    const {name, email, body, commentId} = req.body
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
           return res.json({message: 'No Comment Found'})
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        const newReply = await ReplyToComment.create({
            name,
            email,
            body,
            commentId,
            date_time: dateString
        })
        if (!newReply) {
            throw new Error('Semthing went wrong')
        }
        res.json({
            message: 'Operation Successful',
            reply: {
                id: newReply.dataValues.id,
                name: newReply.dataValues.name,
                date: newReply.dataValues.date_time,
                body: newReply.dataValues.body,
                email: newReply.dataValues.email
            }
        })
    } catch (error) {
        next(error)
    }
}
exports.addComment = async (req, res, next) => {
    const categories = await Category.findAll()
    const cat = []
    try {
        for (let item of categories) {
            cat.push({
                id: item.dataValues.id,
                category: item.dataValues.name
            })
        }
        const {name, body, email, postId} = req.body
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
        const comment = await Comment.create({
            body: body,
            name: name,
            email: email,
            postId: +postId,
            date_time: dateString,
            imageUrl: ''
        })
        if (!comment) {
            throw new Error('Semthing went wrong')
        }
        return res.json({
            message: 'Operation Successful',
            comment: {
                id: comment.dataValues.id,
                name: comment.dataValues.name,
                date: comment.dataValues.date_time,
                body: comment.dataValues.body,
                email: comment.dataValues.email
            }
        }) 
    } catch (error) {
        next(error)
    }
}

exports.get505ErrorPage = async (req, res ) => {
    const categories = await Category.findAll()
    const cat = []
    for (let item of categories) {
        cat.push({
            id: item.dataValues.id,
            category: item.dataValues.name
        })
    }

    res.render('error', {
        title: "Error",
        cat,
        user: req.user
    })
}