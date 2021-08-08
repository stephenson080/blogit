const {auth0Logout} = require('../config/auth0')
const {auth} = require('express-openid-connect')
exports.authenticate = async (req, res, next) => {
    auth(auth0Logout())
}