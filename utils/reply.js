const ReplyModelDB = require('../models/replyToComment')
const {delefile} = require('./helpers')

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
    constructor(id, name, email, body, date, imageUrl) {
        this.id = id
        this.name = name
        this.email = email
        this.body = body
        this.date = date,
        this.imageUrl = imageUrl
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
                    fetchedReply.dataValues.email, fetchedReply.dataValues.body, fetchedReply.dataValues.date_time,
                    fetchedReply.dataValues.imageUrl
                )
                replies.push(reply)
            }
            resolve(replies)
        })
    }
    static addNewReply(name, email, date, body, commentId, imageUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                let newReply = {}
                const createdReply = await ReplyModelDB.create({
                    name,
                    date_time: date,
                    email,
                    body,
                    commentId,
                    imageUrl
                })
                if (!createdReply) {
                    resolve(newReply)
                }
                newReply = new Reply(createdReply.dataValues.id, createdReply.dataValues.name, createdReply.dataValues.email,
                    createdReply.dataValues.body, createdReply.date_time, createdReply.dataValues.imageUrl
                )
                resolve(newReply)
            } catch (error) {
                reject(error)
            }

        })
    }
    static getReplyById(replyId) {
        return new Promise(async (resolve, reject) => {
            try {
                let reply = {}
                const fetchedReply = await ReplyModelDB.findByPk(replyId)
                if (!fetchedReply) {
                    resolve(reply)
                }
                reply = new Reply(fetchedReply.dataValues.id, fetchedReply.dataValues.name, fetchedReply.dataValues.email,
                    fetchedReply.dataValues.body, fetchedReply.dataValues.date_time, fetchedReply.dataValues.imageUrl
                )
                resolve(reply)
            } catch (error) {
                reject(error)
            }
        })
    }

    editReply(name, email, date, body) {
        return new Promise(async (resolve, reject) => {
            try {
                let reply = {}
                await ReplyModelDB.update({
                    name,
                    email,
                    date_time: date,
                    imageUrl,
                    body
                }, {
                    where: {
                        id: this.id
                    }
                })
                // delefile(this.imageUrl)
                reply = new Reply(this.id, name, email, body, date, this.imageUrl)
                resolve(reply)
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteReply() {
        return new Promise(async (resolve, reject) => {
            try {
                const fetchedReply = await ReplyModelDB.findByPk(this.id)
                if(!fetchedReply) {
                    resolve(false)
                }
                await fetchedReply.destroy()
                // delefile(fetchedReply.dataValues.imageUrl)
            } catch (error) {
                reject(error)
            }
        })
    } 
}

module.exports = Reply