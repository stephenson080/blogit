// let post = {}
//     const fetchedPost = await Post.findByPk(postId)
//     const authorname = await Author.findByPk(fetchedPost.dataValues.bloggerId)
//     const category = await Category.findByPk(fetchedPost.dataValues.categoryId)
//     const author = authorname.dataValues.username
//     const commentsCount = await Comment.findAndCountAll({
//         where: {
//             postId: postId
//         }
//     })
//     post = {
//         id: fetchedPost.dataValues.id,
//         title: fetchedPost.dataValues.head_line,
//         likes: fetchedPost.dataValues.likes,
//         category: category.dataValues.name,
//         body: fetchedPost.dataValues.body,
//         imageUrl: fetchedPost.dataValues.imageUrl,
//         date: fetchedPost.dataValues.date_time,
//         author,
//         noOfComments: commentsCount.count,
//         authorId: fetchedPost.dataValues.bloggerId
//     }
//     return post

const PostModelDB = require('../models/post')
const AuthorModelDB = require('../models/blogger')
const CategoryModelDB = require('../models/category')
const CommentModelDB = require('../models/comment')

class Post {
    constructor(id, title, category, body, imageUrl, date, author, authorId, noOfComments, approved, likes) {
        this.id = id
        this.title = title
        this.category = category
        this.body = body
        this.imageUrl = imageUrl
        this.date = date
        this.author = author
        this.authorId = authorId
        this.noOfComments = noOfComments
        this.approved = approved
        this.likes = likes
    }
    static getAllPosts() {
        let posts = []
        return new Promise(async (resolve, reject) => {
            const fetchedPosts = await PostModelDB.findAll()
            for (let fetchedPost of fetchedPosts) {
                const author = await AuthorModelDB.findByPk(fetchedPost.dataValues.bloggerId)
                const authorname = author.dataValues.username
                const category = await CategoryModelDB.findByPk(fetchedPost.dataValues.categoryId)
                const commentsCount = await CommentModelDB.findAndCountAll({
                    where: {
                        postId: fetchedPost.dataValues.id
                    }
                })
                const post = new Post(fetchedPost.dataValues.id, fetchedPost.dataValues.head_line, category.dataValues.name, fetchedPost.dataValues.body,
                    fetchedPost.dataValues.imageUrl, fetchedPost.dataValues.date_time, authorname, author.dataValues.id, commentsCount.count,
                    fetchedPost.dataValues.approved, fetchedPost.dataValues.likes
                )
                posts.push(post)
            }
            resolve(posts)
        })
    }

    static getPostById(postId) {
        return new Promise(async (resolve, reject) => {
            console.log(postId)
            let post = {}
            const fetchedPost = await PostModelDB.findByPk(postId)
            console.log(fetchedPost, postId)
            const author = await AuthorModelDB.findByPk(fetchedPost.dataValues.bloggerId)
            const category = await CategoryModelDB.findByPk(fetchedPost.dataValues.categoryId)
            const authorname = author.dataValues.username
            const commentsCount = await CommentModelDB.findAndCountAll({
                where: {
                    postId: postId
                }
            })
            post = new Post(fetchedPost.dataValues.id, fetchedPost.dataValues.head_line, category.dataValues.name, fetchedPost.dataValues.body,
                fetchedPost.dataValues.imageUrl, fetchedPost.dataValues.date_time, authorname, author.dataValues.id, commentsCount.count,
                fetchedPost.dataValues.approved, fetchedPost.dataValues.likes
            )
            resolve(post)
        })

    }
    approvePost() {
        return new Promise(async (resolve, reject) => {
            const fetchedPost = await PostModelDB.findByPk(this.id)
            if (fetchedPost){
                await fetchedPost.update({
                    approved: true
                })
                resolve(true)
            }
            resolve(false)
        })
    }
}

module.exports = Post