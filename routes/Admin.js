const express = require('express')
const { fetchAllOrders, updateProductById, updateOrderById } = require('../controller/Admin')
const { createProduct } = require('../controller/Product')
const router = express.Router()

router.get('/orders', fetchAllOrders)
    .patch('/orders/:id', updateOrderById)
    .patch('/product-form/edit-product/:id', updateProductById)
    .post('/product-form/add-product',createProduct)



module.exports = { router }