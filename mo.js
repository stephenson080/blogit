const Author = require('./models/blogger')
const Category = require('./models/category')
const Comment = require('./models/comment')
const replyToComment = require('./models/replyToComment')
const Post = require('./models/post')


// Comment.sync()
replyToComment.sync()
