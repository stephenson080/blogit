const express = require('express')
const router = express.Router()
const { body, check } = require('express-validator')
const {getAddCategoryPage, getAllPostsPage, getDashboard, getallUsersPage, getReviewPostPage, approvePost, 
    addNewCategory, getAllCategoriesPage, getEditCategoryPage, editCategory, deleteCategory, approveUser,
    deleteUser
} = require('../controllers/admin')
const isAuth = require('../middlwares/is-Auth')

router.get('/posts/review-post/:postId', isAuth, getReviewPostPage)
router.post('/posts/approve-post/:postId', isAuth, approvePost)
router.get('/categories/add-category', isAuth, getAddCategoryPage)
router.post('/categories/add-category', [
    body('name').isLength({ min: 1 }).withMessage('Please the Category name Field is needed')], addNewCategory)
router.get('/categories/view-categories', isAuth, getAllCategoriesPage)
router.get('/categories/edit-category/:categoryId', isAuth, getEditCategoryPage)
router.post('/categories/edit-category', isAuth, [
    body('name').isLength({ min: 1 }).withMessage('Please the Category name Field is needed')], editCategory )
router.delete('/categories/delete-category/:categoryId', isAuth, deleteCategory)
router.get('/dashboard', isAuth, getDashboard )
router.get('/users/view-users', isAuth, getallUsersPage)
router.delete('/users/delete-user/:userId', isAuth, deleteUser)
router.post('/users/approve-user/:userId', isAuth, approveUser)
router.get('/posts/all-posts', isAuth, getAllPostsPage)



module.exports = router