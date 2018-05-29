
const mongoose = require('mongoose')

module.exports = mongoose.model('goods', new mongoose.Schema({
    "id": String,
    "name": String,
    "price": Number,
    "img": String
}))
