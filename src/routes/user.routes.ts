// Importing and defining Express' router
import { Router } from "express"
const router = Router()
// Importing users controllers
import usersController from '../controllers/users.controllers.js'
// We require our JWT verifier middleware
import verifyJWT from '../middleware/verifyJWT.js'

/* Applying the verifyJWT middleware
to all routes in this file */
router.use(verifyJWT)

// Users data requests routes
router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

export default router