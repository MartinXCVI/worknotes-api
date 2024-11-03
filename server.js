/* This allows us to use the environment
 variable throughout our package */
require('dotenv').config()

// We define Express
const express = require('express')

// We define our app
const app = express()

/* We import the 'path' module to provide utilities 
for working with file and directory paths */
const path = require('node:path')

// We import our logger middleware
const { logger } = require('./middleware/logger')

// We import our errorHandler middleware
const errorHandler = require('./middleware/errorHandler')

// We import the cookie-parser 3rd party Express middleware
const cookieParser = require('cookie-parser')

// We import the Cross-Origin Resource Sharing middleware
const cors = require('cors')

// Setting the CORS options
const corsOptions = require('./config/corsOptions')

// We define the constant for the port
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

// 'logger' middleware to track requests
app.use(logger)

// CORS
app.use(cors(corsOptions))

// Built in middleware in Express to parse incoming requests with JSON
app.use(express.json())

/* 3rd party Express middleware to handle the 
cookies sent from the client to the server */
app.use(cookieParser())

// We provide our app the route to look for static files
app.use('/', express.static(path.join(__dirname, 'public')))

// We require the root of our router
app.use('/', require('./routes/root'))

// Redirection to 'error' page
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

// 'errorHandler' custom middleware to handle the errors
app.use(errorHandler)

// We order our app to start listening
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}...`))