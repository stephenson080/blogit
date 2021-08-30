const ReplyModelDB = require('../models/replyToComment')

let replies = []
//         if (fetchedReplies.length >= 1) {
//             for (let reply of fetchedReplies) {
//                 replies.push({
//                     name: reply.dataValues.name,
//                     id: reply.dataValues.id,
//                     body: reply.dataValues.body,
//                     imageUrl: reply.dataValues.imageUrl,
//                     date: reply.dataValues.date_time,
//                     email: reply.dataValues.email
//                 })

//             }

//         }

class Reply {
    constructor(id, name, email, body, date) {
        this.id = id
        this.name = name
        this.email = email
        this.body = body
        this.date = date
    }
    static getRepliesByCommentId(commentId) {
        return new Promise(async (resolve, reject) => {
            let replies = []
            const fetchedReplies = await ReplyModelDB.findAll({
                where: {
                    commentId: commentId
                }
            })
            for (let fetchedReply of fetchedReplies) {
                const reply = new Reply(fetchedReply.dataValues.id, fetchedReply.dataValues.name, 
                    fetchedReply.dataValues.email, fetchedReply.dataValues.body, fetchedReply.dataValues.date_time
                )
                replies.push(reply)
            }
            resolve(replies)
        })
    }
}

module.exports = Reply