// We require Express
const express = require('express')
// We define our Express router
const router = express.Router()
// We require our notes controllers
const notesController = require('../controllers/notesController.js')
// We require our JWT verifier middleware
const verifyJWT = require('../middleware/verifyJWT.js')

/* Applying the verifyJWT middleware
to all routes in this file */
router.use(verifyJWT)

// Notes data requests routes
router.route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote)

module.exports = router