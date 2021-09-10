const express = require('express')
const router = express.Router()
const { body, check } = require('express-validator')
const {getAddCategoryPage, getAllPostsPage, getDashboard, getallUsersPage, getReviewPostPage, approvePost, 
    addNewCategory, getAllCategoriesPage, getEditCategoryPage, editCategory, deleteCategory, approveUser,
    deleteUser
} = require('../controllers/admin')

router.get('/posts/review-post/:postId', getReviewPostPage)
router.post('/posts/approve-post/:postId', approvePost)
router.get('/categories/add-category', getAddCategoryPage)
router.post('/categories/add-category', [
    body('name').isLength({ min: 1 }).withMessage('Please the Category name Field is needed')], addNewCategory)
router.get('/categories/view-categories', getAllCategoriesPage)
router.get('/categories/edit-category/:categoryId', getEditCategoryPage)
router.post('/categories/edit-category', [
    body('name').isLength({ min: 1 }).withMessage('Please the Category name Field is needed')], editCategory )
router.delete('/categories/delete-category/:categoryId', deleteCategory)
router.get('/dashboard', getDashboard )
router.get('/users/view-users', getallUsersPage)
router.delete('/users/delete-user/:userId', deleteUser)
router.post('/users/approve-user/:userId', approveUser)
router.get('/posts/all-posts', getAllPostsPage)



module.exports = router