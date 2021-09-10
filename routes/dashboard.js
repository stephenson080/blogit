const express = require('express')
const {body} = require('express-validator')
const router = express.Router()
const {getDashboard, getProfilePage, changeProfileDetails} = require('../controllers/dashboard')


router.get('/', getDashboard )
router.get('/profile', getProfilePage)
router.post('/profile', [body('email').isEmail().withMessage('Please enter a correct email')
], changeProfileDetails)

module.exports = router