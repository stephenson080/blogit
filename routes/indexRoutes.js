const express = require('express')
const router = express.Router()
const {getIndexPage} = require('../controllers/index')

router.get('/', getIndexPage )

module.exports = router