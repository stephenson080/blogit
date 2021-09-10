// const Category = require('../models/category')
const {validationResult} = require('express-validator')
const User = require('../utils/user')
const Post = require('../utils/post')
const {getHotPosts} = require('../utils/helpers')

exports.getDashboard = async (req, res, next) => {
    try {
        const user = req.user
        const posts = await Post.getAllPosts()
        const hotPosts = getHotPosts(posts)
        res.render('dashboard/index', {
            title: "Dashboard",
            user,
            posts,
            hotPosts
        }) 
    } catch (error) {
        next(error)
    }
    
}

exports.getProfilePage = async (req, res, next) => {
    const user = req.user
    res.render('dashboard/profile', {
        title: 'Profile',
        user,
        errorMessage: '',
        errorDetails: []
    })
}

exports.changeProfileDetails = async (req, res, next) => {
    const user = req.user
    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed")
            error.data = errors.array()
            return res.render('dashboard/profile', {
                title: 'Profile',
                user,
                errorMessage: error.message,
                errorDetails: error.data
            })
        }
        if (!req.file) {
            return res.render('dashboard/profile', {
                title: 'Profile',
                user,
                errorMessage: 'Validation Failed',
                errorDetails: [{msg: 'Please upload a profile pics'}]
            })
        }
        const edited = await User.editUser(req.user.id, req.body.name, req.body.email, req.file.filename)
        if (edited) {
            return res.render('dashboard/profile', {
                title: 'Profile',
                user: req.user,
                errorMessage: 'Operation Successful',
                errorDetails: [{msg: "You have Successfully Change your Profile"}]
            })
        }
        return res.render('dashboard/profile', {
            title: 'Profile',
            user: req.user,
            errorMessage: 'Somthing went wrong',
            errorDetails: [{msg: "Please Try again"}]
        })
    } catch (error) {
        next(error)
    }
    
}