// We require Express
const express = require('express')
// We define our Express router
const router = express.Router()
/* We import the 'path' module to provide utilities 
for working with file and directory paths */
const path = require('node:path')

// Get request of index.html file
router.get('^/$|/index(.html)?', (req, res)=> {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router