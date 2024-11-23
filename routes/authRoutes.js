// We require Express
const express = require('express')
// We define our Express router
const router = express.Router()
// We require our notes controllers
const authController = require('../controllers/authController')

// Root rout
router.route('/')
  .post()
// Refresh rout
router.route('/refresh')
  .get()
// Logout rout
router.route('/logout')
  .post()

module.exports = router