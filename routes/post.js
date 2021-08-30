const express = require('express')
const router = express.Router()
const { body, check } = require('express-validator')



const { getAddPostPage, getAllPostPage, getEditPostPage, getMyPostPage, addPost, deletePost, 
    editPost, getPostDetailsPage, editComment, editReply, deleteComment, deleteReply } = require('../controllers/post')

router.get('/add-post', getAddPostPage)
router.get('/all-posts', getAllPostPage)
router.get('/edit-post/:postId', getEditPostPage)
router.post('/edit-post', [
    body('title').isLength({ min: 1 }).withMessage('Please the Post Title Field is needed'),
    check('posttype').isLength({ min: 1 }).withMessage('Please the Post type is needed'),
    body('postbody').isLength({ min: 40 })
    .withMessage('Post Body is too short must be 40 Characters least')
], editPost)
router.get('/my-posts', getMyPostPage)
router.post('/add-post', [body('title').trim().isLength({ min: 1 }).withMessage('Please the Post Title Field is needed'),
check('posttype').isLength({ min: 1 }).withMessage('Please the Post type is needed'),
body('postbody').isLength({ min: 40 })
    .withMessage('Post Body is too short must be 40 Characters least')
], addPost)
router.delete('/delete-post', deletePost)
router.get('/view-post/:postId', getPostDetailsPage)
router.post('/edit-comment', [
    body('name').isLength({min: 1}).withMessage('Please the name field is needed'),
    body('body').isLength({min: 1}).withMessage('Please the comment field is needed')
], editComment)
router.post('/edit-reply', [
    body('name').isLength({min: 1}).withMessage('Please the name field is needed'),
    body('body').isLength({min: 1}).withMessage('Please the comment field is needed')
], editReply)

router.delete('/delete-comment/:commentId', deleteComment)
router.delete('/delete-reply/:commentId', deleteReply)



module.exports = router