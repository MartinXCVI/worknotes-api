// We import our helper function
const { logEvents } = require('./logger')

/* Our own error handler that will override
 the default Express errors handler */
const errorHandler = (error, req, res, next)=> {
  logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log')
  console.error(error.stack)

  // We check if the response has a status code
  const status = res.statusCode ? res.statusCode : 500 // default server error status

  // We then set the status
  res.status(status)

  // Our response in JSON format
  res.json({ message: error.message, isError: true })
}

module.exports = errorHandler