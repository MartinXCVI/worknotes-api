// Importing and defining Express' router
import { Router } from 'express'
const router = Router()
// Importing notes controllers
import authController from '../controllers/auth.controllers.js'
// Importing login limiter
import loginLimiter from '../middleware/loginLimiter.js'

// Root rout
router.route('/')
  .post(loginLimiter, authController.login)

// Refresh rout
router.route('/refresh')
  .get(authController.refresh)

// Logout rout
router.route('/logout')
  .post(authController.logout)

export default router