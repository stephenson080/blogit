const CommentModelDB = require('../models/comment')
const Reply = require('./reply')

// let comments = []
//         const fetctedComments = await Comment.findAndCountAll({
//             where: {
//                 postId: postId
//             }
//         })
//         for (let comment of fetctedComments.rows) {
//             const fetchedReplies = await ReplyToComment.findAll({
//                 where: {
//                     commentId: comment.dataValues.id
//                 }
//             })
//             let replies = []
//             if (fetchedReplies.length >= 1) {
//                 for (let reply of fetchedReplies) {
//                     replies.push({
//                         name: reply.dataValues.name,
//                         id: reply.dataValues.id,
//                         body: reply.dataValues.body,
//                         imageUrl: reply.dataValues.imageUrl,
//                         date: reply.dataValues.date_time,
//                         email: reply.dataValues.email
//                     })

//                 }

//             }
//             comments.push({
//                 id: comment.dataValues.id,
//                 name: comment.dataValues.name,
//                 imageUrl: comment.dataValues.imageUrl,
//                 body: comment.dataValues.body,
//                 date: comment.dataValues.date_time,
//                 email: comment.dataValues.email,
//                 postId: comment.dataValues.postId,
//                 replies: replies
//             })

//         }

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
    static getAllCommentsByPostId(postId) {
        return new Promise( async (resolve, reject) => {
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
}

module.exports = Comment