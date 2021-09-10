const express = require('express')
const router = express.Router()
const {get505ErrorPage, veiwPost, addComment, replyComment} = require('../controllers/index')
const {getPostsByCategory} = require('../controllers/post')

const {body} = require('express-validator/')

router.get('/500', get505ErrorPage )
router.get('/view-post/:postId', veiwPost)
router.post('/view-post/add-comment', [
    body('name').isLength({min: 1}).withMessage('Please the name field is needed'),
    body('body').isLength({min: 1}).withMessage('Please the comment field is needed')
], addComment)

router.post('/view-post/reply', [
    body('name').isLength({min: 1}).withMessage('The name field is needed'),
    body('body').isLength({min: 1}).withMessage('Please the comment field is needed')
], replyComment)
router.get('/posts/:categoryId', getPostsByCategory)


module.exports = router