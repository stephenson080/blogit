const express = require('express')
const {body} = require('express-validator')
const router = express.Router()
const {getDashboard, getProfilePage, changeProfileDetails} = require('../controllers/dashboard')


router.get('/dashboard', getDashboard )
router.get('/profile', getProfilePage)
router.post('/update-profile', [body('username').isLength({min: 6}).withMessage('Please your Username should be greater than 6 characters'),
], changeProfileDetails)

module.exports = router