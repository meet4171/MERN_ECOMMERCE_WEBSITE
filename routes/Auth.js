const { createUser, loginUser, checkAuth, logout, sendResetMail,resetPassword } = require('../controller/Auth');
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post('/signup', createUser)

router.post('/login', passport.authenticate('local'), loginUser)

router.get('/checkAuth', passport.authenticate('jwt', { session: false, })
    , checkAuth)

router.post('/reset-password-request', sendResetMail)
router.post('/reset-password', resetPassword)

router.get('/logout', logout)


module.exports = { router };
