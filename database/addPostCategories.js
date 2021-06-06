const Category = require('../models/category')
const categories = [{
    name: "Technology"
},
{
    name: 'Sport'
},
{
    name: 'Travel'
},
{
    name: 'Photography'
},
{
    name: 'Music'
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
    name: 'Programming'
},
{
    name: 'Science'
},
]

for (let cat of categories) {
    Category.create({
        name: cat.name
    })
    .then()
    .catch(console.log)
}
