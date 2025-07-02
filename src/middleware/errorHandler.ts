// Express interfaces imports
import { Request, Response, NextFunction, ErrorRequestHandler } from "express"
// Importing helper function
import { logEvents } from "./logger.js"

/* Custom error handler that will override
 the default Express errors handler */
const errorHandler: ErrorRequestHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  try {
    if(error instanceof Error) {
      logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log')
      console.error(error.stack)
      // Checking if the response has a status code
      const status = res.statusCode !== 200 ? res.statusCode : 500 // default server error status
      // Setting status and response
      res.status(status).json({
        success: false,
        message: error.message,
        error: error.message || error
      })
      return
    } else {
      // Generic error handling
      logEvents(`Unknown error\t${req.method}\t${req.url}\t${req.headers.origin}`, "errorLog.log")
      // Setting status and response
      res.status(500).json({
        success: false,
        message: "Unknown error occurred",
        error: error
      })
      return
    }
  } catch(error: unknown) {
    if(error instanceof Error) {
      console.error(`Error in errorHandler middleware: ${error.message || error}`)
    } else {
      console.error(`Error in errorHandler middleware: ${error}`)
    }
    res.status(500).json({
      success: false,
      message: "Internal server error while attempting handle the error via errorHandler middleware",
      error: error
    })
    return
  }
} // End of errorHandler

export default errorHandler