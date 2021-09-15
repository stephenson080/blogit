const express = require('express')
const {body} = require('express-validator')
const router = express.Router()
const {getDashboard, getProfilePage, changeProfileDetails} = require('../controllers/dashboard')
const isAuth = require('../middlwares/is-Auth')


router.get('/', isAuth, getDashboard )
router.get('/profile', isAuth, getProfilePage)
router.post('/profile', isAuth, [body('email').isEmail().withMessage('Please enter a correct email')
], changeProfileDetails)

module.exports = router