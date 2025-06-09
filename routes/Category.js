const express = require('express')
const { fetchAllCategory, createCategory } = require('../controller/Category')

const router = express.Router()

router.get('/', fetchAllCategory)
    .post('/', createCategory)

module.exports = { router }