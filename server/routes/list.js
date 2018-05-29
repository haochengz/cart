
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {db_con} = require('./../vars.js')

let goods = require('../models/goods')

mongoose.connect(db_con)

mongoose.connection.on("connected", () => {
    console.log("Connected to db")
})

mongoose.connection.on("error", () => {
    console.log("Cannot connected to db")
})

mongoose.connection.on("disconnected", () => {
    console.log("connection lost for some reason")
})

router.get("/", (req, resp, next) => {
    goods.find({}, (err, doc) => {
        if(err){
            resp.json({
                status: '1',
                msg: err.message
            })
        }
        else{
            resp.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list:doc
                }
            })
        }
    })
})

module.exports = router
