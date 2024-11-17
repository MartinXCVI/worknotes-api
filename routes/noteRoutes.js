// We require Express
const express = require('express')
// We define our Express router
const router = express.Router()
// We require our notes controllers
const notesController = require('../controllers/notesController.js')

// Notes data requests routes
router.route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote)

module.exports = router