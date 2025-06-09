const express = require('express')
const { fetchUserById, updateUser } = require('../controller/User')
const router = express.Router()

router.get('/', fetchUserById)
    .patch('/', updateUser)
module.exports = { router }