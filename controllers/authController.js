// Requiring our User model
const User = require('../models/User')
// Requiring bcrypt for hashing passwords
const bcrypt = require('bcrypt')
// Jason Web Token
const jwt = require('jsonwebtoken')
/* Requiring the Express Async Hanlder for 
handling exceptions inside of async express routes
and passing them to your express error handlers */
const asyncHandler = require('express-async-handler')

// @desc Login
// @route /auth
// @method POST
// @access Public
const login = asyncHandler(async (req, res) => {
  // Expecting a username & a password
  const { username, password } = req.body
  // Checking if we receive username & password
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  // Looking for the user in our DB
  const foundUser = await User.findOne({ username }).exec()
  // Checking if the user exists or is active
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  // If user exists, we check if the passwords match
  const match = await bcrypt.compare(password, foundUser.password)
  // Error if there is not a match
  if (!match) return res.status(401).json({ message: 'Unauthorized' })
  
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "username": foundUser.username,
        "roles": foundUser.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { "username": foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  // Create secure cookie with refresh token 
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessible only by web server 
    secure: true, // https
    sameSite: 'None', // cross-site cookie 
    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  })
  // Send accessToken containing username and roles 
  res.json({ accessToken })
})

// @desc Refresh
// @route /auth/refresh
// @method GET
// @access Public - (because access token has expired)
const refresh = (req, res) => {
  // Expecting a cookie with the request
  const cookies = req.cookies
  // Error if there is not a cookie
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
  // If there is
  const refreshToken = cookies.jwt

  // Verifying the token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      // Handling the error
      if (error) return res.status(403).json({ message: 'Forbidden' })
      // Checking if we have the user in a decoded name from the refreshToken
      const foundUser = await User.findOne({ username: decoded.username }).exec()
      // If there is no user
      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })
      
      // If there is a user, we create a new access token
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": foundUser.username,
            "roles": foundUser.roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      )
      // Responding with the accessToken
      res.json({ accessToken })
    })
  )
}

// @desc Logout
// @route /auth/logout
// @method POST
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  // Expecting a cookie with the request
  const cookies = req.cookies
  // Error if there is not a cookie
  if (!cookies?.jwt) return res.sendStatus(204) // No content
  // We remove the cookie when then user decides to logout
  res.clearCookie('jwt', { 
    /* passing all the same options 
    when we created the cookie */
    httpOnly: true, 
    sameSite: 'None', 
    secure: true 
  })
  // Success response
  res.json({ message: 'Cookie cleared' })
}

// Exporting all controller methods
module.exports = {
  login,
  refresh,
  logout
}