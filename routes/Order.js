const express = require('express')
const { addNewOrder, updateOrderById } = require('../controller/Order')
const { fetchOrdersByUser } = require('../controller/User')
const router = express.Router()

router.post('/', addNewOrder)
    .get('/', fetchOrdersByUser)

module.exports = { router }