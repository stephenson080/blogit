// const Category = require('../models/category')
const {validationResult} = require('express-validator')
const Author = require('../models/blogger')

exports.getDashboard = async (req, res, next) => {
    // const categories = await Category.findAll()
    // const cat = []
    // for (let item of categories) {
    //     cat.push({
    //         id: item.dataValues.id,
    //         category: item.dataValues.name
    //     })
    // }
    const user = req.user
    res.render('dashboard/index', {
        title: "Dashboard",
        user
    })
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
        await Author.update({
            username: req.body.username,
            email: req.body.email,
            imageUrl: req.file.filename
        }, {where: {id: req.user.id}})
        return res.render('dashboard/profile', {
            title: 'Profile',
            user: req.user,
            errorMessage: 'Operation Successful',
            errorDetails: [{msg: "You have Successfully Change your Profile"}]
        })
    } catch (error) {
        next(error)
    }
    
}