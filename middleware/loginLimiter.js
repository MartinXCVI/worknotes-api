// Requiring express-rate-limit middleware
const rateLimit = require('express-rate-limit')
// We import our helper function
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per `window` per minute
  message:
    { message: 'Too many login attempts from this IP, please try again after 60 seconds' },
    handler: (req, res, next, options) => {
      logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
      res.status(options.statusCode).send(options.message)
    },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter