const express = require('express')
const app = express()
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
// const fileUpload = require('express-fileupload')
const multer = require('multer')
const { auth } = require('express-openid-connect')


const CategoryModelDB = require('./models/category')
const Author = require('./models/blogger')
const User = require('./utils/user')
const Post = require('./models/post')
const Comment = require('./models/comment')
const ReplyToComment = require('./models/replyToComment')
const {get404Page} = require('./controllers/index')
const Category = require('./utils/category')

// app.use(fileUpload({parseNested: true, debug: true}))

const indexroutes = require('./routes/indexRoutes')
const { getIndexOrDashBoardPage } = require('./controllers/index')
const dashboardRoutes = require('./routes/dashboard')
const postRoutes = require('./routes/post')
const adminRoutes = require('./routes/adminRoutes')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// file handling with multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, `blogit${file.originalname}`)
    }
})

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images')
//     }, 
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now().toString()}_${file.originalname}`)
//     }
// })


const auth0Config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER_BASEURL
};

const {connectDb} = require('./database/dbConnection')
const dbConnection = connectDb()
const PORT = process.env.PORT

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(multer({ storage: fileStorage }).single('imageUrl'))

// S
app.use(cors())
app.set('view engine', 'ejs')

app.use(auth(auth0Config))


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'images')))
app.use('/', express.static(path.join(__dirname, 'images')))
app.use('/posts/', express.static(path.join(__dirname, 'public')))
app.use('/posts/', express.static(path.join(__dirname, 'images')))
app.use('/view-post', express.static(path.join(__dirname, 'public')))
app.use('/view-post', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/profile', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/profile', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/posts', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/posts', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/posts/edit-post', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/posts/edit-post', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/posts/view-post', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/posts/view-post', express.static(path.join(__dirname, 'images')))
app.use('/admin/users/view-users', express.static(path.join(__dirname, 'public')))
app.use('/admin/users/view-users', express.static(path.join(__dirname, 'images')))
app.use('/admin/', express.static(path.join(__dirname, 'public')))
app.use('/admin/', express.static(path.join(__dirname, 'images')))
app.use('/admin/posts/', express.static(path.join(__dirname, 'public')))
app.use('/admin/posts/', express.static(path.join(__dirname, 'images')))
app.use('/admin/posts/review-post', express.static(path.join(__dirname, 'public')))
app.use('/admin/posts/review-post', express.static(path.join(__dirname, 'images')))
app.use('/admin/categories/', express.static(path.join(__dirname, 'public')))
app.use('/admin/categoris/', express.static(path.join(__dirname, 'images')))
app.use('/admin/categories/view-categories', express.static(path.join(__dirname, 'public')))
app.use('/admin/categories/view-categories', express.static(path.join(__dirname, 'images')))
app.use('/admin/categories/edit-category/', express.static(path.join(__dirname, 'public')))
app.use('/admin/categories/edit-category/', express.static(path.join(__dirname, 'images')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/materialize-css/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/materialize-css/dist/js')))

app.use(async (req, res, next) => {
    if (req.oidc.user) {
        const user = await Author.findByPk(req.oidc.user.sub)
        if (user) {
            req.user = {
                id: user.dataValues.id,
                email: user.dataValues.email,
                username: user.dataValues.username,
                imageUrl: user.dataValues.imageUrl,
                role: user.dataValues.role,
                approved: user.dataValues.approved
            }
            return next()
        }
    }
    next()
})

app.use((req, res, next) => {
    res.locals.user = req.oidc.user
    next()
})
app.use(indexroutes)
app.use('/dashboard', dashboardRoutes)
app.get('/', async (req, res, next) => {
    const isAuthenticated = req.oidc.isAuthenticated();
    const user = req.oidc.user
    getIndexOrDashBoardPage(req, res, next, isAuthenticated, user)
})
app.use('/dashboard/posts', postRoutes)
app.use('/admin', adminRoutes)

app.use(async (error, req, res, next) => {
    console.log(error)
    const cat = await Category.getAllCategories()
    if (error.statusCode) {
        return res.json({
            message: error.message
        })
    }
    res.render('error', {
        user: req.user,
        title: 'Error',
        cat
    })
})
app.use(get404Page)

// apps entry point
dbConnection
    .sync({force: true})
    // .sync()
    .then(async res => {
        app.listen(PORT || 3000, function () {
            console.log(`server running on ${PORT}`)
        })
    })
    .catch(err => console.log(err))


