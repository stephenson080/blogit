const User = require('../utils/user')
const Post = require('../utils/post')
const Comment = require('../utils/comment')
const Category = require('../utils/category')
const {getHotPosts} = require('../utils/helpers')
const { validationResult } = require('express-validator')
// const Reply = require('../utils/reply')

exports.getDashboard = async (req, res, next) => {
    let hotPostsNoOfComments = []
    let posts = []
    try {
        posts = await Post.getAllPosts()
        const users = await User.getUsers()
        const hotPosts = getHotPosts(posts)
        res.render('admin/index', {
            title: 'Admin dashboard',
            user: req.user,
            hotPosts,
            posts,
            users
        })
    } catch (error) {
        next(error)
    }

}

exports.getallUsersPage = async (req, res, next) => {
    try {
        console.log(req.user)
        const users = await User.getUsers()
        res.render('admin/user/view-users', {
            title: 'All Users',
            users: users,
            user: req.user
        })
    } catch (error) {
        next(error)
    }
}

exports.approveUser = async (req, res, next) => {
    try {
        const approved = await User.approveUser(req.params.userId)
        if (approved) {
            return res.json({
                message: 'Operation Successful'
            })
        }
        return res.json({
            message: 'Somthing went wrong'
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.getAllPostsPage = async (req, res, next) => {
    try {
        const posts = await Post.getAllPosts()
        console.log(posts)
        res.render('admin/post/all-posts', {
            title: 'All Posts',
            posts,
            user: req.user
        })
    } catch (error) {
        next(error)
    }

}

exports.getAddCategoryPage = (req, res) => {
    res.render('admin/categories/add-category', {
        title: 'Add New Category',
        user: req.user,
        errorMessage: '',
        errorDetails: []
    })
}

exports.getAllCategoriesPage = async (req, res, next) => {
    try {
        const categories = await Category.getAllCategories()
        res.render('admin/categories/view-categories', {
            title: 'View Categories',
            user: req.user,
            categories
        })
    } catch (error) {
        next(error)
    }
}

exports.getEditCategoryPage = async (req, res, next) => {
    try {
        const category = await Category.getCategoryById(req.params.categoryId)
        if (category) {
            return res.render('admin/categories/edit-category', {
                title: 'Edit Category',
                user: req.user,
                category,
                errorMessage: '',
                errorDetails: []
            })
        }
        throw new Error('Something went wrong')
    } catch (error) {
        next(error)
    }
}

exports.editCategory = async (req, res, next) => {
    const user = req.user
    let category = {}
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            category = await Category.getCategoryById(req.body.categoryId)
            const error = new Error("Validation Failed")
            error.data = errors.array()
            return res.render('admin/categories/edit-category', {
                title: 'Edit Category',
                user,
                category,
                errorMessage: error.message,
                errorDetails: error.data
            })
        }
        if (!req.file) {
            category = await Category.getCategoryById(req.body.categoryId)
            return res.render('admin/categories/edit-category', {
                title: 'Edit Category',
                user,
                category,
                errorMessage: 'Validation Failed',
                errorDetails: [{ msg: 'No image Uploaded' }]
            })
        }
        category = await Category.getCategoryById(req.body.categoryId)
        const updated = await category.updateCategory(req.body.name, req.file.filename)
        if (updated) {
            return res.render('admin/categories/edit-category', {
                title: 'Edit Category',
                user,
                category,
                errorMessage: 'Operation Successful',
                errorDetails: [{ msg: 'Category Have been updated' }]
            })
        }
        return res.render('admin/categories/edit-category', {
            title: 'Edit Category',
            user,
            category,
            errorMessage: 'Something went wrong',
            errorDetails: [{ msg: 'Please Try again' }]
        })
    } catch (error) {
        next(error)
    }
}

exports.addNewCategory = async (req, res, next) => {
    const user = req.user
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error("Validation Failed")
            error.data = errors.array()
            return res.render('admin/categories/add-category', {
                title: 'Add New Category',
                user,
                errorMessage: error.message,
                errorDetails: error.data
            })
        }
        if (!req.file) {
            return res.render('admin/categories/add-category', {
                title: 'Add New Category',
                user,
                errorMessage: 'Validation Failed',
                errorDetails: [{ msg: 'No image Uploaded' }]
            })
        }
        const { name } = req.body
        const newCat = await Category.addNewCategory(name, req.file.filename)
        if (newCat) {
            return res.render('admin/categories/add-category', {
                title: 'Add New Category',
                user,
                errorMessage: 'Operation Successful',
                errorDetails: [{ msg: "You have Successfully added a Category." }]
            })
        }
        return res.render('admin/categories/add-category', {
            title: 'Add New Category',
            user,
            errorMessage: 'Something Went Wrong',
            errorDetails: [{ msg: 'Please Try Again' }]
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.getCategoryById(req.params.categoryId)
        if (category) {
            const deleted = await category.deleteCategory()
            if (deleted) {
                return res.json({
                    message: 'Operation Successful'
                })
            }
            return res.json({
                message: 'Something went wrong'
            })
        }
        return res.json({
            message: "Coudn't get a category"
        })
    } catch (error) {
        const err = {
            statusCode: 500,
            message: error.message
        }
        next(err)
    }
}

exports.getReviewPostPage = async (req, res, next) => {
    try {
        const postId = req.params.postId
        const post = await Post.getPostById(postId)

        const comments = await Comment.getAllCommentsByPostId(post.id)
        // console.log(post.id, post)

        return res.render('admin/post/review-post', {
            title: 'Review Post',
            post,
            user: req.user,
            comments: comments
        })
    } catch (error) {
        next(error)
    }
}

exports.approvePost = async (req, res, next) => {
    try {
        const post = await Post.getPostById(req.params.postId)
        if (post) {
            const approved = await post.approvePost()
            if (approved) {
                return res.json({
                    message: 'Operation Successful',
                })
            }
            return res.json({
                message: 'Something went wrong'
            })
        }
        return res.json({
            message: 'No Post Found'
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const deleted = await User.deleteUser(req.params.userId)
        if (deleted) {
            return res.json({
                message: 'Operation Successful'
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