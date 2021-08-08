const Category = require('../models/category')
const Author = require('../models/blogger')
exports.getIndexOrDashBoardPage = async (req, res, next, isAuthenticated, user) => {
    let fetchedUser = {}
    const categories = await Category.findAll()
    const cat = []
    for (let item of categories) {
        cat.push({
            id: item.dataValues.id,
            category: item.dataValues.name
        })
    }
    if (isAuthenticated) {
        req.user = user
        console.log(user)
        try {
            const author = await Author.findAll({
                where: {
                    email: user.email
                }
            })            
            if (author[0]) {
                fetchedUser = {
                    email: author[0].email,
                    username: author[0].username,
                    imageUrl: author[0].picture,
                    password: author[0].password,
                }
                return res.render('dashboard/index', {
                    title: 'Dashboard',
                    user: fetchedUser
                })
            }
            const newAuthor = await Author.create({
                email: user.email,
                imageUrl: user.picture,
                username: user.nickname,
                password: user.password
            })
            console.log('new Author', newAuthor)
            fetchedUser = {
                email: newAuthor.dataValues.email,
                username: newAuthor.dataValues.username,
                imageUrl: newAuthor.dataValues.picture,
                password: newAuthor.dataValues.password
            }
            return res.render('dashboard/index', {
                title: 'Dashboard',
                user: fetchedUser
            })
        } catch (error) {
            next(error)
        }
    }
    res.render('index', {
        title: "BLOGit Home",
        cat,
        user: req.user
    })
}

exports.get505ErrorPage = async (req, res ) => {
    const categories = await Category.findAll()
    const cat = []
    for (let item of categories) {
        cat.push({
            id: item.dataValues.id,
            category: item.dataValues.name
        })
    }

    res.render('error', {
        title: "Error",
        cat,
        user: req.user
    })
}