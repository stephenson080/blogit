const CategoryModelDB = require('../models/category')
const {delefile} = require('./helpers')

class Category {
    constructor(id, category, imageUrl) {
        this.id = id
        this.category = category
        this.imageUrl = imageUrl
    }
    static getCategoryById(categoryId) {
        return new Promise(async (resolve, reject) => {
            let category = {}
            try {
                const fetchedCat = await CategoryModelDB.findByPk(categoryId)
                category = new Category(fetchedCat.dataValues.id, fetchedCat.dataValues.name, fetchedCat.dataValues.imageUrl)
                if (category) {
                    resolve(category)
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    static getAllCategories() {
        return new Promise(async (resolve, reject) => {
            try {
                const categories = await CategoryModelDB.findAll()
                const cat = []
                for (let item of categories) {
                    const category = new Category(item.dataValues.id, item.dataValues.name, item.dataValues.imageUrl)
                    cat.push(category)
                }
                resolve(cat)
            } catch (error) {
                reject(error)
            }
        })
    }
    static addNewCategory(name, imageUrl) {
        return new Promise(async (resolve, reject) => {
            let category = {}
            try {
                const newCat = await CategoryModelDB.create({
                    name: name,
                    imageUrl: imageUrl
                })
                if (newCat) {
                    category = new Category(newCat.dataValues.id, newCat.dataValues.name, newCat.dataValues.imageUrl)
                    resolve(category)
                }
                resolve(category)
            } catch (error) {
                reject(error)
            }
        })
    }
    updateCategory(name, imageUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const fetchedCat = await CategoryModelDB.findByPk(this.id)
                if (fetchedCat) {
                    delefile(fetchedCat.dataValues.imageUrl)
                    await fetchedCat.update({
                        name: name,
                        imageUrl: imageUrl
                    })
                    resolve(true)
                }
                resolve(false)
            } catch (error) {
                reject(error)
            }

        })
    }
    deleteCategory() {
        return new Promise(async (resolve, reject) => {
            try {
                const fetchedCat = await CategoryModelDB.findByPk(this.id)
                if (fetchedCat) {
                    await fetchedCat.destroy()
                    delefile(fetchedCat.dataValues.imageUrl)
                    resolve(true)
                }
                resolve(false)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = Category