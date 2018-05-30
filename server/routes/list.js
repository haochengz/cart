
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {db_con} = require('./../vars.js')

let goods = require('../models/goods')
let users = require('../models/user')

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

function buildFilterParams(query){
    if(query.filterField == 'price'){
        return {
            price:{
                $gte: parseInt(query.filterStarts),
                $lt: parseInt(query.filterEnds)
            }
        }
    }
    else{
        return {}
    }
}

function returnErrorJson(err, resp){
    resp.json({
        status: '1',
        msg: err.message
    })
}

function returnResult(doc, resp){
    resp.json({
        status: '0',
        msg: 'success',
        result: {
            count: doc.length,
            list: doc
        }
    })
}

router.get("/", (req, resp, next) => {
    let raw_data = retrieveItems(buildFilterParams(req.query))
    if(req.query.sortingField == 'price'){
        raw_data = sortItems(parseInt(req.query.sorting), raw_data)
    }
    let data = paginator(
        parseInt(req.query.page),
        parseInt(req.query.pageSize),
        raw_data
    )

    data.exec((err, doc) => {
        if(err){
            returnErrorJson(err, resp)
        }
        else{
            returnResult(doc, resp)
        }
    })
})

router.post("/addToCart", (req, resp, next) => {})

module.exports = router
