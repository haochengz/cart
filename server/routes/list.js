
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

function retrieveItems(findParams){
    return goods.find(findParams)
}

function sortItems(sorting, retriever){
    return retriever.sort({
        price: sorting
    })
}

function paginator(page, pageSize, retriever) {
    skip = (page - 1) * pageSize
    return retriever.skip(skip).limit(pageSize)
}

router.get("/", (req, resp, next) => {
    let sorting = parseInt(req.query.sorting)
    let page = parseInt(req.query.page)
    let pageSize = parseInt(req.query.pageSize)
    let sortingField = req.query.sortingField
    let findParams = {}

    let raw_data = retrieveItems(findParams)
    if(sortingField == 'price'){
        raw_data = sortItems(sorting, raw_data)
    }
    data = paginator(page, pageSize, raw_data)

    data.exec((err, doc) => {
        if(err){
            resp.json({
                status: '1',
                msg: err.message
            })
        }
        else{
            resp.json({
                status: '0',
                msg: 'Success',
                result: {
                    count: doc.length,
                    list:doc
                }
            })
        }
    })
})

module.exports = router
