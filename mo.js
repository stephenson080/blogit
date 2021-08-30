const moment = require('moment')
const CategoryModelDB = require('./models/category')

const date = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')

console.log(date)

async function test(name, imageUrl) {
    try {
        const newCat = await CategoryModelDB.create({
            name: name,
            imageUrl: imageUrl
        })
        console.log(newCat)
    } catch (error) {
    }
}


test('Stephen', 'ijidjd;lsnd')

