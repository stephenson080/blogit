const CommentModelDB = require('../models/comment')
const ReplyModelDB = require('../models/replyToComment')
const Reply = require('./reply')

class Comment {
    constructor(id, name, email, body, date, imageUrl, postId, replies) {
        this.id = id
        this.name = name
        this.email = email
        this.body = body
        this.date = date
        this.imageUrl = imageUrl
        this.postId = postId,
        this.replies = replies
    }
    static getCommentById(commentId) {
        return new Promise(async (resolve, reject) => {
            let comment = {}
            try {
                const fetchedComment = await CommentModelDB.findByPk(commentId)
                if (!fetchedComment) {
                    resolve(comment)
                }
                const replies = await Reply.getRepliesByCommentId(fetchedComment.dataValues.id)
                comment = new Comment(fetchedComment.dataValues.id, fetchedComment.dataValues.name,
                    fetchedComment.dataValues.email, fetchedComment.dataValues.body, fetchedComment.dataValues.date_time,
                    fetchedComment.dataValues.imageUrl, fetchedComment.dataValues.postId, replies
                )
                resolve(comment)
            } catch (error) {
                reject(error)
            }
        })
    }
    static getAllCommentsByPostId(postId) {
        return new Promise(async (resolve, reject) => {
            let comments = []
            const fetchedComments = await CommentModelDB.findAll({
                where: {
                    postId: postId
                }
            })
            for (let fetchedComment of fetchedComments) {
                let replies = await Reply.getRepliesByCommentId(fetchedComment.dataValues.id)
                const comment = new Comment(fetchedComment.dataValues.id, fetchedComment.dataValues.name,
                    fetchedComment.dataValues.email, fetchedComment.dataValues.body, fetchedComment.dataValues.date_time,
                    fetchedComment.dataValues.imageUrl, fetchedComment.dataValues.postId, replies
                )
                comments.push(comment)
            }
            resolve(comments)
        })

    }
    static addNewComment(name, email, date, postId, body, imageUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                let newComment = {}
                const createdComment = await CommentModelDB.create({
                    name,
                    email,
                    postId,
                    date_time: date,
                    body,
                    imageUrl: imageUrl
                })
                if (!createdComment) {
                    resolve(newComment)
                }
                newComment = new Comment(createdComment.dataValues.id, createdComment.dataValues.name,
                    createdComment.dataValues.email, createdComment.dataValues.body, createdComment.dataValues.date_time,
                    createdComment.dataValues.imageUrl, createdComment.dataValues.postId, []
                )
                resolve(newComment)
            } catch (error) {
                reject(error)
            }
        })

    }
    editComment(name, email, body, date) {
        return new Promise(async (resolve, reject) => {
            try {
                let comment = {}
                const fetchedComment = await CommentModelDB.findByPk(this.id)
                if (!fetchedComment) {
                    resolve(comment)
                }
                await fetchedComment.update({
                    name,
                    email,
                    body,
                    date_time: date
                })
                comment = new Comment(this.id, name, email, body, date, this.imageUrl, this.postId, this.replies)
                resolve(comment)
            } catch (error) {
                reject(error)
            }
        })
    }
    static deleteComment(commentId) {
        return new Promise(async (resolve, reject) => {
            try {
                const comment = await CommentModelDB.findByPk(commentId)
                if (!comment) {
                    resolve(false)
                }

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
                // delefile(comment.dataValues.imageUrl)
                await comment.destroy()
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = Comment