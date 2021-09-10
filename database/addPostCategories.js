const Category = require('../models/category')
const categories = [{
    name: "Technology",
    imageUrl: 'tech.jpg'
},
{
    name: 'Sport',
    imageUrl: 'sport.jpg'
},
{
    name: 'Travel',
    imageUrl: 'travel.jpg'
},
{
    name: 'Photography',
    imageUrl: 'photo'
},
{
    name: 'Music',
    imageUrl: 'music.jpg'
},
{
    name: 'Culture'
},
{
    name: 'Food'
},
{
    name: 'Fiction'
},
{
    name: 'Articles'
},
{
    name: 'Product Review'
},
{
    name: 'Programming',
    imageUrl: 'program.jpg'
},
{
    name: 'Science',
    imageUrl: 'science.jpeg'
},
]

for (let cat of categories) {
    Category.create({
        name: cat.name,
        imageUrl: cat.imageUrl
    })
    .then()
    .catch(console.log)
}
