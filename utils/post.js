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
const ReplyModelDB = require('../models/replyToComment')
const { delefile } = require('./helpers')

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
            try {
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
            } catch (error) {
                reject(error)
            }

        })
    }

    static getPostById(postId) {
        return new Promise(async (resolve, reject) => {
            try {
                let post = {}
                const fetchedPost = await PostModelDB.findByPk(postId)
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
            } catch (error) {
                reject(error)
            }

        })

    }
    approvePost() {
        return new Promise(async (resolve, reject) => {
            const fetchedPost = await PostModelDB.findByPk(this.id)
            if (fetchedPost) {
                await fetchedPost.update({
                    approved: true
                })
                resolve(true)
            }
            resolve(false)
        })
    }
    static addNewPost(title, bloggerId, body, date, imageUrl, categoryId) {
        return new Promise(async (resolve, reject) => {
            try {
                let newPost = {}
                const createdPost = await PostModelDB.create({
                    head_line: title,
                    bloggerId,
                    body,
                    date_time: date,
                    imageUrl,
                    categoryId,
                    likes: 0
                })
                if (!createdPost) {
                    resolve(newPost)
                }
                const author = await AuthorModelDB.findByPk(createdPost.dataValues.bloggerId)
                const category = await CategoryModelDB.findByPk(createdPost.dataValues.categoryId)
                const authorname = author.dataValues.username
                const commentsCount = await CommentModelDB.findAndCountAll({
                    where: {
                        postId: createdPost.dataValues.id
                    }
                })
                newPost = new Post(createdPost.dataValues.id, createdPost.dataValues.head_line, category.dataValues.name,
                    createdPost.dataValues.body, createdPost.dataValues.imageUrl, createdPost.dataValues.date_time,
                    authorname, createdPost.dataValues.bloggerId, commentsCount.count, createdPost.dataValues.approved,
                    createdPost.dataValues.likes
                )
                resolve(newPost)
            } catch (error) {
                reject(error)
            }
        })
    }
    static deletePost(postId) {
        return new Promise(async (resolve, reject) => {
            try {
                const fetchedPost = await PostModelDB.findByPk(postId)
                if (!fetchedPost) {
                    resolve(false)
                }
                const fetchedComments = await CommentModelDB.findAll({
                    where: {
                        postId: postId
                    }
                })
                for (let comment of fetchedComments) {
                    const replies = await ReplyModelDB.findAll({
                        where: {
                            commentId: comment.dataValues.id
                        }
                    })
                    if (replies.length >= 1) {
                        for (let reply of replies) {
                            // delefile(reply.dataValues.imageUrl)
                            await reply.destroy()
                        }
                    }
                    //delefile(comment.dataValues.imageUrl)//
                    await comment.destroy()
                }
                delefile(fetchedPost.dataValues.imageUrl)
                await fetchedPost.destroy()
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }
    editPost(title, imageUrl, body, categoryId, date) {
        return new Promise(async (resolve, reject) => {
            try {
                await PostModelDB.update({
                    head_line: title,
                    imageUrl,
                    body,
                    categoryId,
                    date_time: date
                }, {
                    where: {
                        id: this.id
                    }
                })
                delefile(this.imageUrl)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }
    static getPostsByUserId(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                let posts = []
                const fetchedPosts = await PostModelDB.findAll({
                    where: {
                        bloggerId: userId
                    }
                })
                if (fetchedPosts.length <= 0) {
                    resolve(posts)
                }
                for (let fetchedPost of fetchedPosts) {
                    const category = await CategoryModelDB.findByPk(fetchedPost.dataValues.categoryId)
                    const commentsCount = await CommentModelDB.findAndCountAll({
                        where: {
                            postId: fetchedPost.dataValues.id
                        }
                    })
                    const post = new Post(fetchedPost.dataValues.id, fetchedPost.dataValues.head_line, category.dataValues.name, fetchedPost.dataValues.body,
                        fetchedPost.dataValues.imageUrl, fetchedPost.dataValues.date_time, 'Me', userId, commentsCount.count,
                        fetchedPost.dataValues.approved, fetchedPost.dataValues.likes
                    )
                    posts.push(post)
                }
                resolve(posts)
            } catch (error) {
                reject(error)
            }
        })
    }
    static getPostsByCategory(categoryId) {
        return new Promise(async (resolve, reject) => {
            try {
                let posts = []
                const fetchedPosts = await PostModelDB.findAll({
                    where: {
                        categoryId: categoryId
                    }
                })
                if (fetchedPosts.length <= 0) {
                    resolve(posts)
                }
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
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = Post