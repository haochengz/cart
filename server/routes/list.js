
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

function returnErrorJson(err, resp, debugLog=""){
    resp.json({
        status: '1',
        msg: err == null ? "" : err.message,
        log: debugLog
    })
}

function returnSuccessJson(msg, resp) {
    resp.json({
        status: '0',
        msg: msg
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

function retrieveProductFromDB(userId, productId, resp) {
    goods.findOne({id: productId}, (err, product) => {
        if(err){
            returnErrorJson(err, resp, "Cannot find product by " + productId)
        }
        else{
            if(product == null) {
                returnErrorJson(null, resp, "Cannot find product by " + productId)
            }
            addToUserCart(product, userId, resp)
        }
    })
}

function addToUserCart(product, userId, resp){
    users.findOne({id: userId}, (err, user) => {
        if(err) {
            returnErrorJson(err, resp, "Cannot find user by " + userId)
        }
        else{
            if(user == null) {
                returnErrorJson(null, resp, "Cannot find user by " + userId)
            }
            addItemToCart(product, user, resp)
        }
    })
}

function addItemToCart(product, user, resp) {
    let flag = true
    for(item of user.itemsInCart){
        if(item.productId == product.id) {
            flag = false
            item.number += 1
            user.save()
            returnSuccessJson("Add one to exists item", resp)
        }
    }
    if(flag){
        user.itemsInCart.push({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImg: product.img,
            isSelected: false,
            number: 1
        })
        user.save()
        returnSuccessJson("Add new item to cart", resp)
    }
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

router.put("/cart", (req, resp, next) => {
    fakeUserId = "001"
    userId = fakeUserId
    productId = req.body.productId
    retrieveProductFromDB(userId, productId, resp)
})

module.exports = router
