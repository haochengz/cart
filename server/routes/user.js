var express = require('express')
var router = express.Router()

router.post('/', (req, res, next) => {
  console.log('Receive request, check the parameters')
  console.log(req.body.username + ' ' + req.body.password)
})

module.exports = router
