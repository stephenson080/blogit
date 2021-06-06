const express = require('express')
const app = express()
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')

const Category = require('./models/category')
const Blogger = require('./models/blogger')
const Post = require('./models/post')

const indexroutes = require('./routes/indexRoutes')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const dbConnnection = require('./database/dbConnection')
const PORT = process.env.PORT

app.use(helmet())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(indexroutes)


dbConnnection
.sync()
.then(res => {
    app.listen(PORT, function () {
        console.log(`server running on ${PORT}`)
    })
})
.catch(err => console.log(err))


