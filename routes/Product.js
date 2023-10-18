const express = require('express')
const { fetchAllProducts, fetchProductById } = require('../controller/Product')

const router = express.Router()
router.get('/', fetchAllProducts)
router.get('/:id', fetchProductById)

module.exports = { router }



