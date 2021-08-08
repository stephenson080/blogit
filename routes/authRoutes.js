const express = require('express')
const router = express.Router()
const {authenticate} = require('../controllers/auth')

router.get('/sign-up', authenticate )

module.exports = router