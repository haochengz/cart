
const mongoose = require('mongoose')

module.exports = mongoose.model('users', new mongoose.Schema({
  'id': String,
  'username': String,
  'email': String,
  'password': String,
  'itemsInCart': [
    {
      'productId': String,
      'productName': String,
      'productPrice': Number,
      'productImg': String,
      'isSelected': Boolean,
      'number': Number
    }
  ],
  'orders': Array,
  'address': Array
}), 'users')
