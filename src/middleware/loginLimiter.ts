// Importing Express interfaces
import { Request, Response, NextFunction } from 'express'
// express-rate-limit middleware imports
import rateLimit from 'express-rate-limit'
import { Options } from 'express-rate-limit'
// Importing helper function for logging events
import { logEvents } from './logger.js'

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per `window` per minute
  message:
    { message: 'Too many login attempts from this IP, please try again after 60 seconds' },
    handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
      logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
      res.status(options.statusCode).send(options.message)
    },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export default loginLimiter