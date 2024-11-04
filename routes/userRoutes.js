// We require Express
const express = require('express')
// We define our Express router
const router = express.Router()
// We require our users controllers
const usersController = require('../controllers/usersController')

// Users data requests routes
router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

module.exports = router