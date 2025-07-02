// Importing Express interfaces
import { Request, Response } from "express"
// Importing custom interfaces
import { ILogin } from "./interfaces/ILogin.js"
// Importing the User model
import UserModel from "../models/User.model.js"
// Importing bcrypt for hashing passwords
import bcrypt from 'bcrypt'
// Importing JSON Web Token
import jwt from 'jsonwebtoken'
/* Importing the Express Async Hanlder for 
handling exceptions inside of async express routes
and passing them to your express error handlers */
import asyncHandler from 'express-async-handler'


// @desc Login
// @route /auth
// @method POST
// @access Public
const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Expecting a username & a password
  const { username, password } = req.body as ILogin
  // Checking if we receive username & password
  if(!username || !password) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }
  // Looking for the user in our DB
  const foundUser = await UserModel.findOne({ username }).exec()
  // Checking if the user exists or is active
  if(!foundUser || !foundUser.active) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  // If user exists, we check if the passwords match
  const match = await bcrypt.compare(password, foundUser.password)
  // Error if there is not a match
  if(!match) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "username": foundUser.username,
        "roles": foundUser.roles
      }
    },
    String(process.env.ACCESS_TOKEN_SECRET),
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { "username": foundUser.username },
    String(process.env.REFRESH_TOKEN_SECRET),
    { expiresIn: '7d' }
  )

  // Create secure cookie with refresh token 
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessible only by web server 
    secure: process.env.NODE_ENV === 'production', // https
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // cross-site cookie 
    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  })
  // Send accessToken containing username and roles 
  res.json({ accessToken })
  return
}) // End of login controller


// @desc Refresh
// @route /auth/refresh
// @method GET
// @access Public - (because access token has expired)
const refresh = (req: Request, res: Response): void => {
  // Expecting a cookie with the request
  const cookies = req.cookies
  // Error if there is not a cookie
  if(!cookies?.jwt) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  // If there is
  const refreshToken = cookies.jwt

  // Verifying the token
  jwt.verify(
    refreshToken,
    String(process.env.REFRESH_TOKEN_SECRET),
    async (error: any, decoded: any) => {
      // Handling the error
      if(error || !decoded || typeof decoded !== 'object' || !('username' in decoded)) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }
      
      try {
        // Checking if we have the user in a decoded name from the refreshToken
        const foundUser = await UserModel.findOne({ username: decoded.username }).exec()
        // If there is no user
        if(!foundUser) {
          res.status(401).json({ message: 'Unauthorized' })
          return
        }
        
        // If there is a user, we create a new access token
        const accessToken = jwt.sign(
          {
            "UserInfo": {
              "username": foundUser.username,
              "roles": foundUser.roles
            }
          },
          String(process.env.ACCESS_TOKEN_SECRET),
          { expiresIn: '15m' }
        )
        // Responding with the accessToken
        res.json({ accessToken })
      } catch(error: unknown) {
        error instanceof Error
        ? console.error(`Error refreshing token: ${error.message || error}`)
        : console.error(`Error refreshing token: ${error}`)
        res.status(500).json({
          success: false,
          message: 'Internal server error while attempting to refresh token',
          error: error instanceof Error ? error.message : error
        })
      }
    }
  )
  return
} // End of refresh controller


// @desc Logout
// @route /auth/logout
// @method POST
// @access Public - just to clear cookie if exists
const logout = (req: Request, res: Response): void => {
  // Expecting a cookie with the request
  const cookies = req.cookies
  // Error if there is not a cookie
  if(!cookies?.jwt) {
    res.sendStatus(204) // No content
    return
  }
  // We remove the cookie when then user decides to logout
  res.clearCookie('jwt', { 
    /* passing all the same options 
    when we created the cookie */
    httpOnly: true, 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    secure: process.env.NODE_ENV === 'production'
  })
  console.log('User logged out. Cookie cleared.')
  // Success response
  res.json({ message: 'Cookie cleared.' })
  return
} // End of logout controller

// Exporting all controller methods
export default {
  login,
  refresh,
  logout
}