const express = require('express')
const { addToCart, fetchCartByUser, udpateCartItem, deleteCartItem } = require('../controller/Cart')
const router = express.Router()


router.post('/', addToCart)
    .get('/Items', fetchCartByUser)
    .patch('/:id', udpateCartItem)
    .delete('/:id', deleteCartItem)

module.exports = { router }