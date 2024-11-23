// We require Express
const express = require('express')
// We define our Express router
const router = express.Router()
// We require our notes controllers
const authController = require('../controllers/authController')
// We require our login limiter
const loginLimiter = require('../middleware/loginLimiter')

// Root rout
router.route('/')
  .post(loginLimiter, authController.login)

// Refresh rout
router.route('/refresh')
  .get(authController.refresh)

// Logout rout
router.route('/logout')
  .post(authController.logout)

module.exports = router