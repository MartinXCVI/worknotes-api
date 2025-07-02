// Express interfaces imports
import { Request, Response, NextFunction } from 'express'
// Importing the 'format' function from date-fns library
import { format } from 'date-fns'
// Import version *4* universally unique identifier 
import { v4 as uuidv4 } from 'uuid'
// Import the file system module from node
import fs from 'node:fs'
// Import the promise-based file system's APIs
import fsPromises from 'node:fs/promises'
/* Import the 'path' module to provide utilities 
for working with file and directory paths */
import path from 'node:path'


// Helper function to log events
const logEvents = async (message: string, logFileName: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`

  /* If the logs folder does not exist, we create it
  After that, we append the logs file */
  try {
    if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName), logItem
    )
  } catch(error: unknown) {
    if(error instanceof Error) {
      console.error(error.message || error)
    } else {
      console.error(error)
    }
  }
}

// Actual middleware to create the logs file and log the data
const logger = (req: Request, res: Response, next: NextFunction)=> {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method} ${req.path}`)
  next()
}

export { logEvents, logger }