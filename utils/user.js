const Author = require('../models/blogger')
const { delefile } = require('./helpers')
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
            let user = {}
            try {
                const fetchedUser = await Author.findByPk(userId)
                if (fetchedUser) {
                    user = new User(fetchedUser.dataValues.id, fetchedUser.dataValues.username, fetchedUser.dataValues.imageUrl,
                        fetchedUser.dataValues.email, fetchedUser.dataValues.role, fetchedUser.dataValues.approved
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
    static addnewUser(user) {
        let newUser = {}
        return new Promise(async (resolve, reject) => {
            try {
                const createdUser = await Author.create({
                    id: user.sub,
                    username: user.nickname,
                    email: user.email ? user.email : '',
                    imageUrl: user.picture,
                    approved: false,
                    role: 'author'
                })
                newUser = new User(createdUser.dataValues.id, createdUser.dataValues.username,
                    createdUser.dataValues.imageUrl, createdUser.dataValues.email, createdUser.dataValues.role,
                    createdUser.dataValues.approved
                )
                resolve(newUser)
            } catch (error) {
                reject(error)
            }
        })
    }
    static editUser(userId, name, email, imageUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getUserById(userId)
                if (user) {
                    await Author.update({
                        name: name,
                        email: email,
                        imageUrl: imageUrl
                    }, {
                        where: {
                            id: userId
                        }
                    })
                    delefile(user.imageUrl)
                    resolve(true)
                }

            } catch (error) {
                reject(error)
            }
        })
    }
    static deleteUser(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await Author.findByPk(userId)
                if (!user) {
                    resolve(false)
                }
                // delefile(user.dataValues.imageUrl)
                await user.destroy()
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = User