const express = require('express')
const router = express.Router()
const {get505ErrorPage} = require('../controllers/index')

router.get('/500', get505ErrorPage )

module.exports = router