// Importing and defining Express' router
import { Router } from "express"
const router = Router()
// Importing notes controllers
import notesController from '../controllers/notes.controllers.js'
// Importing JWT verifier middleware
import verifyJWT from '../middleware/verifyJWT.js'

/* Applying the verifyJWT middleware
to all routes in this file */
router.use(verifyJWT)

// Notes data requests routes
router.route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote)

export default router