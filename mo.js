const moment = require('moment')

const date = moment().utcOffset(60).format('hh:mm DD MMMM YYYY')

console.log(date)