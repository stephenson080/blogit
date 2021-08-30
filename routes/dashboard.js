const express = require('express')
const {body} = require('express-validator')
const router = express.Router()
const {getDashboard, getProfilePage, changeProfileDetails} = require('../controllers/dashboard')


router.get('/dashboard', getDashboard )
router.get('/profile', getProfilePage)
router.post('/update-profile', [body('email').isEmail().withMessage('Please enter a correct email')
], changeProfileDetails)

module.exports = router