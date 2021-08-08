const Category = require('../models/category')
const path = require('path')
const Post = require('../models/post')
const Author = require('../models/blogger')
const { validationResult } = require('express-validator')
const moment = require('moment')
const { delefile, getPostById } = require('../utils/helpers')




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
        const fetedPosts = await Post.findAll()
        for (let post of fetedPosts) {
            let authorName = await Author.findByPk(post.dataValues.bloggerId)
            console.log(authorName.dataValues.username)
            posts.push({
                id: post.dataValues.id,
                title: post.dataValues.head_line,
                categoryId: post.dataValues.categoryId,
                likes: post.dataValues.likes,
                date_time: post.dataValues.date_time,
                body: post.dataValues.body,
                author: req.user.id == authorName.dataValues.id ? 'Me' : authorName.dataValues.username,
                imageUrl: post.dataValues.imageUrl
            })
        }
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
    const user = req.user
    const { postId } = req.body
    try {
        const post = await Post.findByPk(postId)
        if (post) {
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
        console.log(upPost)
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

exports.getPostDetailsPage = async (req, res, next) => {
    const user = req.user
    const postId = req.params.postId
    const post = await getPostById(postId)
    res.render('dashboard/post/postdetails', {
        title: 'View Post',
        user,
        post
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
            posts.push({
                id: post.dataValues.id,
                title: post.dataValues.head_line,
                categoryId: post.dataValues.categoryId,
                likes: post.dataValues.likes,
                date_time: post.dataValues.date_time,
                body: post.dataValues.body,
                author: 'Me',
                imageUrl: post.dataValues.imageUrl
            })
        }

        res.render('dashboard/post/myposts', {
            title: 'My Posts',
            user,
            posts
        })
    }catch (error) {
        next(error)
    }
}