const express = require('express')
const app = express()
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
// const fileUpload = require('express-fileupload')
const multer = require('multer')
const { auth } = require('express-openid-connect')


const Category = require('./models/category')
const Author = require('./models/blogger')
const Post = require('./models/post')
const Comment = require('./models/comment')
const ReplyToComment = require('./models/replyToComment')

// app.use(fileUpload({parseNested: true, debug: true}))

const indexroutes = require('./routes/indexRoutes')
const { getIndexOrDashBoardPage } = require('./controllers/index')
const dashboardRoutes = require('./routes/dashboard')
const postRoutes = require('./routes/post')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// file handling with multer
const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "images")
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now().toString() + "_" + file.originalname)
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

const dbConnnection = require('./database/dbConnection')
const PORT = process.env.PORT

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(multer({storage: fileStorage}).single('postimage'))

// S
// app.use(cors())
app.set('view engine', 'ejs')

app.use(auth(auth0Config))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', express.static(path.join(__dirname, 'images')))
app.use('/view-post', express.static(path.join(__dirname, 'public')))
app.use('/view-post', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/posts', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/posts', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/posts/edit-post', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/posts/edit-post', express.static(path.join(__dirname, 'images')))
app.use('/dashboard/posts/view-post', express.static(path.join(__dirname, 'public')))
app.use('/dashboard/posts/view-post', express.static(path.join(__dirname, 'images')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/materialize-css/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/materialize-css/dist/js')))

app.use( async (req, res, next) => {
    if (req.oidc.user) {
        const user =  await Author.findAll({
            where: { email: req.oidc.user.email }
        })
        if (user[0]) {
            req.user = {
                id: user[0].id,
                email: user[0].email,
                username: user[0].username,
                imageUrl: user[0].imageUrl
            }
        }
        return next()
    }
    next()
})

app.use((req, res, next) => {
    res.locals.user = req.oidc.user
    next()
})
app.use(indexroutes)
app.use(dashboardRoutes)
app.get('/', (req, res, next) => {
    console.log(req.oidc)
    const isAuthenticated = req.oidc.isAuthenticated();
    const user = req.oidc.user
    getIndexOrDashBoardPage(req, res, next, isAuthenticated, user)
})
app.use('/dashboard/posts', postRoutes)




app.use((error, req, res, next) => {
    console.log(error)
    res.redirect('/500')
})


// apps entry point
dbConnnection
    .sync()
    .then(async res => {
        app.listen(PORT, function () {
            console.log(`server running on ${PORT}`)
        })
    })
    .catch(err => console.log(err))


