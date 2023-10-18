const express = require('express')
const { fetchAllBrands, createBrand } = require('../controller/Brands')
const router = express.Router()
router.get('/', fetchAllBrands)
    .post('/', createBrand)

module.exports = { router }



