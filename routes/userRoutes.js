// We require Express
const express = require('express')
// We define our Express router
const router = express.Router()
// We require our users controllers
const usersController = require('../controllers/usersController')
// We require our JWT verifier middleware
const verifyJWT = require('../middleware/verifyJWT.js')

/* Applying the verifyJWT middleware
to all routes in this file */
router.use(verifyJWT)


// Users data requests routes
router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

module.exports = router