
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {dbcon} = require('./../vars.js')

let goods = require('../models/goods')
let users = require('../models/user')

mongoose.connect(dbcon)

mongoose.connection.on('connected', () => {
  console.log('Connected to db')
})

mongoose.connection.on('error', () => {
  console.log('Cannot connected to db')
})

mongoose.connection.on('disconnected', () => {
  console.log('connection lost for some reason')
})

function retrieveItems (findParams) {
  return goods.find(findParams)
}

function sortItems (sorting, retriever) {
  return retriever.sort({
    price: sorting
  })
}

function paginator (page, pageSize, retriever) {
  let skip = (page - 1) * pageSize
  return retriever.skip(skip).limit(pageSize)
}

function buildFilterParams (query) {
  if (query.filterField === 'price') {
    return {
      price: {
        $gte: parseInt(query.filterStarts),
        $lt: parseInt(query.filterEnds)
      }
    }
  } else {
    return {}
  }
}

function returnErrorJson (err, resp, debugLog = '') {
  resp.json({
    status: '1',
    msg: err == null ? '' : err.message,
    log: debugLog
  })
}

function returnSuccessJson (msg, resp) {
  resp.json({
    status: '1',
    msg: msg
  })
}

function returnResult (doc, resp) {
  resp.json({
    status: '0',
    msg: 'success',
    result: {
      count: doc.length,
      list: doc
    }
  })
}

function retrieveProductFromDB (userId, productId, resp) {
  goods.findOne({id: productId}, (err, product) => {
    if (err) {
      returnErrorJson(err, resp, 'Cannot find product by ' + productId)
    } else {
      if (product == null) {
        returnErrorJson(null, resp, 'Cannot find product by ' + productId)
      }
      addToUserCart(product, userId, resp)
    }
  })
}

function addToUserCart (product, userId, resp) {
  users.findOne({_id: userId}, (err, user) => {
    if (err) {
      returnErrorJson(err, resp, 'Cannot find user by ' + userId)
    } else {
      if (user == null) {
        returnErrorJson(null, resp, 'Cannot find user by ' + userId)
      }
      addItemToCart(product, user, resp)
    }
  })
}

function addItemToCart (product, user, resp) {
  let flag = true
  for (let item of user.itemsInCart) {
    if (item.productId === product.id) {
      flag = false
      item.number += 1
      user.save()
      returnSuccessJson('Add one to exists item', resp)
    }
  }
  if (flag) {
    console.log('Product Image: ' + product.image)
    user.itemsInCart.push({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImg: product.image,
      isSelected: false,
      number: 1
    })
    user.save()
    returnSuccessJson('Add new item to cart', resp)
  }
}

router.get('/', (req, resp, next) => {
  let rawData = retrieveItems(buildFilterParams(req.query))
  if (req.query.sortingField === 'price') {
    rawData = sortItems(parseInt(req.query.sorting), rawData)
  }
  let data = paginator(
    parseInt(req.query.page),
    parseInt(req.query.pageSize),
    rawData
  )

  data.exec((err, doc) => {
    if (err) {
      returnErrorJson(err, resp)
    } else {
      returnResult(doc, resp)
    }
  })
})

router.put('/cart', (req, resp, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  retrieveProductFromDB(userId, productId, resp)
})

router.get('/cart', (req, resp, next) => {
  const userId = req.cookies.userId
  if (!userId) throw Error('Cannot determined the user')

  users.findOne({
    _id: userId
  }, (err, doc) => {
    if (err) {
      returnErrorJson(err, resp)
    } else {
      if (!doc) {
        returnErrorJson('Cannot retrieve any user from user id', resp)
      } else {
        resp.json({
          status: '1',
          result: {
            count: 1,
            data: doc.itemsInCart
          }
        })
      }
    }
  })
})

module.exports = router
