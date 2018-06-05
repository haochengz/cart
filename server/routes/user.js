
var express = require('express')
var router = express.Router()

let users = require('../models/user')

router.put('/login', (req, res, next) => {
  console.log('Receive request, check the parameters')
  console.log(req.body.username + ' ' + req.body.password)
  let username = req.body.username
  let password = req.body.password
  users.findOne({
    username: username,
    password: password
  }, (err, doc) => {
    console.log('DOC:' + doc)
    if (err) {
      res.json({
        status: 0,
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc._id, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.json({
          status: 1,
          msg: 'success',
          result: {
            count: 1,
            data: doc
          }
        })
      } else {
        res.json({
          status: 0,
          msg: 'Username of password are not exists'
        })
      }
    }
  })
})

router.delete('/login', (req, resp, next) => {
  resp.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  // TODO: quit session
  resp.json({
    status: 1,
    msg: 'success'
  })
})

module.exports = router
