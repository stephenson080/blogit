const Category = require('../utils/category')
const path = require('path')
const Post = require('../utils/post')
const Reply = require('../utils/reply')
const Comment = require('../utils/comment')
const { validationResult } = require('express-validator')
const moment = require('moment')
const { delefile} = require('../utils/helpers')




exports.getAddPostPage = async (req, res, next) => {
    const user = req.user
    try {
        const cat = await Category.getAllCategories()

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
    const cat = await Category.getAllCategories()
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
        const newPost = await Post.addNewPost(title, req.user.id, postbody, dateString, req.file.filename, posttype)
        if (newPost) {
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
        posts = await Post.getAllPosts()
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
        const deleted = await Post.deletePost(postId)
        if (deleted) {
            return res.json({ message: 'Post Successfully Deleted' })
        }
        return res.json({ message: 'Something went wrong' })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.getEditPostPage = async (req, res, next) => {
    const postId = req.params.postId
    try {
        const cat = await Category.getAllCategories()
        const user = req.user
        const post = await Post.getPostById(postId)
        return res.render(`dashboard/post/editpost`, {
            title: 'Edit Post',
            user,
            post,
            cat,
            errorMessage: '',
            errorDetails: []
        })
    } catch (error) {
        next(error)
    }

}

exports.editPost = async (req, res, next) => {
    const user = req.user
    try {
        const cat = await Category.getAllCategories()
        const { title, posttype, postbody, postId } = req.body
        const post = await Post.getPostById(postId)
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
        const edited = await post.editPost(title, req.file.filename, postbody, posttype, dateString)
        if(edited){
            return res.render(`dashboard/post/editpost`, {
                title: 'Edit Post',
                user,
                cat,
                post,
                errorMessage: 'Operation Successful',
                errorDetails: [{ msg: "You have Successfully edited your post" }]
            })
        }
        return res.render(`dashboard/post/editpost`, {
            title: 'Edit Post',
            user,
            cat,
            post,
            errorMessage: 'Something went wrong',
            errorDetails: [{ msg: "Sorry Couldn't edit your post" }]
        })

    } catch (error) {
        next(error)
    }
}

exports.editComment = async (req, res, next) => {
    const { name, body, email, commentId } = req.body
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
        if (!comment) {
            throw new Error('Something went wrong')
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        const editedComment = await comment.editComment(name, email, body, dateString)
        if (editedComment){
            return res.json({
                message: 'Operation Successful',
                comment: editedComment
            })
        }
        return res.json({
            message: 'Something went wrong'
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.editReply = async (req, res, next) => {
    const { name, body, email, commentId } = req.body
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
        const reply = await Reply.getReplyById(commentId)
        if (!reply.id) {
            throw new Error('No record Found')
        }
        const dateString = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')
        const editedReply = reply.editReply(name, email, dateString, body)
        if (editedReply) {
            return res.json({
                message: 'Operation Successful',
                reply: editedReply
            })
        }
        res.json({
            message: 'Something went wrong'
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.deleteReply = async (req, res, next) => {
    const { commentId } = req.params
    try {
        const reply = await Reply.findByPk(commentId)
        if (!reply.name) {
            throw new Error('No record Found')
        }
        // delefile(reply.dataValues.imageUrl)
        const deleted = await reply.deleteReply()
        if (deleted) {
            return res.json({
                message: 'Operation Successful'
            })
        }
        res.json({
            message: 'Something went wrong'
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.deleteComment = async (req, res, next) => {
    const { commentId } = req.params
    try {
        const deleted = await Comment.deleteComment(commentId)
        if (deleted) {
            return res.json({
                message: 'Operation Successful'
            })
        }
        res.json({
            message: 'Something went wrong'
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.getPostDetailsPage = async (req, res, next) => {
    const user = req.user
    const postId = req.params.postId
    const post = await Post.getPostById(postId)
    const comments = await Comment.getAllCommentsByPostId(postId)
    res.render('dashboard/post/postdetails', {
        comments,
        title: 'View Post',
        user,
        post,
    })
}
exports.getMyPostPage = async (req, res, next) => {
    const user = req.user
    try {
        const posts = await Post.getPostsByUserId(user.id)
        res.render('dashboard/post/myposts', {
            title: 'My Posts',
            user,
            posts
        })
    } catch (error) {
        next(error)
    }
}
exports.getPostsByCategory = async (req, res, next) => {
    try {
        const posts = await Post.getPostsByCategory(req.params.categoryId)
        const category = await Category.getCategoryById(req.params.categoryId)
        const cat = await Category.getAllCategories()
        res.render('allposts-by-cat', {
            title: `${category.category} Posts`,
            posts,
            cat,
            user: req.user,
        })
    } catch (error) {
        next(error)
    }
}

