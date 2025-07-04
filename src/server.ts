/* ENVIRONMENT VARIABLES IMPORTS */
import { NODE_ENV, PORT_ENV } from "./config/env.js"

/* ES Module patch for __dirname */
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/* EXPRESS SETUP */
import express from 'express'
const app = express()
app.set('trust proxy', 1) // Trust the proxy to read the X-Forwarded-For header

/* NODE IMPORTS */
import path from "node:path" // provide utilities for working with file and directory paths

/* MIDDLEWARES & UTILITIES */
// We import the cookie-parser 3rd party Express middleware
import cookieParser from 'cookie-parser'
// We import the Cross-Origin Resource Sharing middleware
import cors from 'cors'
/* Calling the Mongoose library to help with data modeling,
 schema enforcement, and model validation for MongoDB */
import mongoose from 'mongoose'

/* INTERNAL IMPORTS */
// Importing logger middleware
import { logger } from './middleware/logger.js'
// Importing logEvents middleware
import { logEvents } from './middleware/logger.js'
// Import errorHandler middleware
import errorHandler from './middleware/errorHandler.js'
// Setting the CORS options
import corsOptions from './config/corsOptions.js'
// Database connection
import connectDB from './config/dbConnection.js'

/* ROUTES IMPORTS */
import rootRoutes from './routes/root.routes.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import noteRoutes from './routes/note.routes.js'

// Defining the constant for the port
const PORT = PORT_ENV || 3500
// Logging in the console our Node environment variable
console.log(NODE_ENV)

// Calling the DB connection function
connectDB()

/* APPLYING MIDDLEWARES */
// 'logger' middleware to track requests
app.use(logger)
// CORS implementation
app.use(cors(corsOptions))
// Built-in middleware in Express to parse incoming requests with JSON
app.use(express.json())
/* 3rd party Express middleware to handle the 
cookies sent from the client to the server */
app.use(cookieParser())

/* Providing the route for where to look for static files */
app.use('/', express.static(path.join(__dirname, 'public')))

/* API ROUTES */
// Requiring the root of our router
app.use('/', rootRoutes)
// Requiring the auth route
app.use('/auth', authRoutes)
// Requiring the users route
app.use('/users', userRoutes)
// Requiring the notes route
app.use('/notes', noteRoutes)

// Redirection to 'error' page - Catching all 404s
app.all('*', (req, res)=> {
  res.status(404)
  if(req.accepts('html')) {
    // HTML response
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if(req.accepts('json')) {
    // JSON response
    res.json({ message: '404 - Not found' })
  } else {
    // Plain text response
    res.type('txt').send('404 - Not found')
  }
})

/* Custom middleware to handle the errors */
app.use(errorHandler)

/* Wrapping our app listen event inside a 
listener for the mongoose connection */
mongoose.connection.once('open', ()=> {
  console.log('>Server connected to MongoDB')
  // We order our app to start listening
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}...`))
})

// Listener of MongoDB errors
mongoose.connection.on('error', error => {
  console.error(error)
  logEvents(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
  'mongoErrorLog.log'
  )
})
