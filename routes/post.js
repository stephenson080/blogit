const express = require('express')
const router = express.Router()
const { body, check } = require('express-validator')
const isAuth = require('../middlwares/is-Auth')



const { getAddPostPage, getAllPostPage, getEditPostPage, getMyPostPage, addPost, deletePost, 
    editPost, getPostDetailsPage, editComment, editReply, deleteComment, deleteReply } = require('../controllers/post')

router.get('/add-post', isAuth, getAddPostPage)
router.get('/all-posts', isAuth, getAllPostPage)
router.get('/edit-post/:postId', isAuth, getEditPostPage)
router.post('/edit-post', isAuth, [
    body('title').isLength({ min: 1 }).withMessage('Please the Post Title Field is needed'),
    check('posttype').isLength({ min: 1 }).withMessage('Please the Post type is needed'),
    body('postbody').isLength({ min: 40 })
    .withMessage('Post Body is too short must be 40 Characters least')
], editPost)
router.get('/my-posts', isAuth, getMyPostPage)
router.post('/add-post', isAuth, [body('title').trim().isLength({ min: 1 }).withMessage('Please the Post Title Field is needed')
.isLength({max: 45}).withMessage('Please the post title is too long'),
check('posttype').isLength({ min: 1 }).withMessage('Please the Post type is needed'),
body('postbody').isLength({ min: 40 })
    .withMessage('Post Body is too short must be 40 Characters least')
], addPost)
router.delete('/delete-post', isAuth, deletePost)
router.get('/view-post/:postId', isAuth, getPostDetailsPage)
router.post('/edit-comment', isAuth, [
    body('name').isLength({min: 1}).withMessage('Please the name field is needed'),
    body('body').isLength({min: 1}).withMessage('Please the comment field is needed')
], editComment)
router.post('/edit-reply', isAuth, [
    body('name').isLength({min: 1}).withMessage('Please the name field is needed'),
    body('body').isLength({min: 1}).withMessage('Please the comment field is needed')
], editReply)

router.delete('/delete-comment/:commentId', isAuth, deleteComment)
router.delete('/delete-reply/:commentId', isAuth, deleteReply)



module.exports = router