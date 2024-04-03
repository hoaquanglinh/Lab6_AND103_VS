const mongoose = require('mongoose')
const Scheme = mongoose.Schema;

const Fruits = new Scheme({
    image: {type: Array},
    name: {type: String},
    quantity: {type: Number},
    price: {type: Number},
    distributor: {type: String},
    description: {type: String}
})

module.exports = mongoose.model('fruit', Fruits)