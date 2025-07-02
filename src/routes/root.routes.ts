// Importing Express interfaces
import { Request, Response } from "express"
// Importing and defining Express' router
import { Router } from 'express'
const router = Router()
/* Importing the 'path' module to provide utilities 
for working with file and directory paths */
import path from 'node:path'

// Get request of index.html file
router.get('^/$|/index(.html)?', (req: Request, res: Response)=> {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

export default router