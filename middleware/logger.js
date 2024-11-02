// We import the 'format' function from date-fns library
const { format } = require('date-fns')

// We import the version *4* universally unique identifier 
const { v4: uuid } = require('uuid')

// We import the file system module from node
const fs = require('node:fs')

// We import the promise-based file system's APIs
const fsPromises = require('node:fs/promises')

/* We import the 'path' module to provide utilities 
for working with file and directory paths */
const path = require('node:path')


// Helper function to log events
const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  /* If the logs folder does not exist, we create it
  After that, we append the logs file */
  try {
    if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName), logItem
    )
  } catch(error) {
    console.error(error)
  }
}

// Actual middleware to create the logs file and log the data
const logger = (req, res, next)=> {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method} ${req.path}`)
  next()
}

module.exports = { logEvents, logger }