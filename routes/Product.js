const express = require('express')
const { createProduct, fetchAllProducts, fetchProductById } = require('../controller/Product')
const { updateProductById } = require('../controller/Admin')

const router = express.Router()
router
    .get('/', fetchAllProducts)
    .get('/:id', fetchProductById)

module.exports = { router }



