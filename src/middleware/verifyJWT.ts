// Importing Express interfaces
import { Request, Response, NextFunction } from 'express'
import { IDecodedUser } from '../interfaces/IDecodedUser.js'
// Environment variables imports
import { ACCESS_TOKEN_SECRET } from '../config/env.js'
// JSON web token
import jwt from 'jsonwebtoken'


const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  /* Making sure there is an authorization in the headers
  of the request, either lowercase or capitalized 
  Since there is not an standard, it is proper 
  to look for both as a general good practice */
  const authHeader = req.headers.authorization || req.headers.Authorization

  // Checking if the headers start with the proper string
  if(typeof authHeader !== 'string' || !authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  /* Grabbing the token by spliting the headers string 
  and taking the second value at position 1 in the array */
  const token = authHeader.split(' ')[1]

  // Defining secret argument for jwt.verify()
  const secret = ACCESS_TOKEN_SECRET
  if(!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined')
  }

  /* Passing the token to the 'verify' method, and 
  verifying it with our access token secret */
  jwt.verify(
    token,
    secret,
    (error, decoded)=> {
      if(error) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }
      const decodedTyped = decoded as IDecodedUser
      req.user = decodedTyped.UserInfo.username
      req.roles = decodedTyped.UserInfo.roles
      next()
    }
  )
  return
}

export default verifyJWT