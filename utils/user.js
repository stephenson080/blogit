const Author = require('../models/blogger')
class User {
    constructor(id, username, imageUrl, email, role, approved) {
        this.id = id
        this.username = username
        this.imageUrl = imageUrl
        this.email = email
        this.role = role
        this.approved = approved
    }
    static getUserById(userId) {
        return new Promise(async (resolve, reject) => {
            const user = {}
            try {
                const fetchedUser = await Author.findByPk(userId)
                if (fetchedUser) {
                    user = new User(fetchedUser.dataValues.id, fetchedUser.dataValues.username, fetchedUser.dataValues.imageUrl,
                        fetchedUser.dataValues.email, fetchedUser.dataValues.approved
                    )
                    resolve(user)
                }
                resolve(user)
            } catch (error) {
                reject(error)
            }
        })
    }
    static getUsers() {
        let users = []
        return new Promise(async (resolve, reject) => {
            const fetchedUsers = await Author.findAll()
            for (let fetchedUser of fetchedUsers) {
                const user = new User(fetchedUser.dataValues.id, fetchedUser.dataValues.username, fetchedUser.dataValues.imageUrl, fetchedUser.dataValues.email, fetchedUser.dataValues.role, fetchedUser.dataValues.approved)
                users.push(user)
            }
            resolve(users)
        }
        )
    }
    static approveUser(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await Author.findByPk(userId)
                if (user) {
                    await user.update({
                        approved: true
                    })
                    resolve(true)
                }
                resolve(false)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = User