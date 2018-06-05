
var express = require('express')
var router = express.Router()

let users = require('../models/user')

router.put('/login', (req, resp, next) => {
  let username = req.body.username
  let password = req.body.password
  users.findOne({
    username: username,
    password: password
  }, (err, doc) => {
    if (err) {
      resp.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        resp.cookie('userId', doc._id, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        resp.json({
          status: '1',
          msg: 'success',
          result: ''
        })
      } else {
        resp.json({
          status: '0',
          msg: 'Username of password are not exists'
        })
      }
    }
  })
})

router.get('/login', (req, resp, next) => {
  const userId = req.cookies.userId
  users.findOne({
    _id: userId
  }, (err, doc) => {
    if (err) {
      resp.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    } else {
      resp.json({
        status: '1',
        msg: 'Already logged in',
        result: {
          count: 1,
          data: doc
        }
      })
    }
  })
})

router.delete('/login', (req, resp, next) => {
  resp.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })

  resp.json({
    status: '1',
    msg: 'success'
  })
})

module.exports = router
