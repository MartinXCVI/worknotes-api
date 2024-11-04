// Requiring our models
const User = require('../models/User')
const Note = require('../models/Note')

/* Requiring the Express Async Hanlder for 
handling exceptions inside of async express routes
and passing them to your express error handlers */
const asyncHandler = require('express-async-handler')

// Requiring the Bcrypt library to hash passwords
const bcrypt = require('bcrypt')

/*-- CONTROLLER FUNCTIONS --*/

// @description: Get all users
// @route: /users
// @method: GET
// @access: Private
const getAllUsers = asyncHandler(async (req, res)=> {
  // We prevent the password to be sent back to the client
  // lean() method to return JSON instead of a Mongoose document
  const users = await User.find().select('-password').lean()
  if(!users) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.json(users)
})

// @description: Create new user
// @route: /users
// @method: POST
// @access: Private
const createNewUser = asyncHandler(async (req, res)=> {
  // Destructuring the data we'll receive from the frontend
  const { username, password, roles } = req.body

  // Confirming data
  if(!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  // Checking for duplicates
  // Mongoose exec() will execute the query and return a Promise
  const duplicate = await User.findOne({ username }).lean().exec()

  if(duplicate) {
    return res.status(409).json({ message: 'Duplicated username' })
  }

  // Hashing the password
  const hashedPass = await bcrypt.hash(password, 10) // salt rounds

  // Creating the user object
  const userObject = { username, "password": hashedPass, roles }

  // Creating and storing a new user
  const user = await User.create(userObject)

  if(user) { // if created
    res.status(201).json({ message: `New user ${username} has been created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
})

// @description: Update a user
// @route: /users
// @method: PATCH
// @access: Private
const updateUser = asyncHandler(async (req, res)=> {
  
})

// @description: Delete a user
// @route: /users
// @method: DELETE
// @access: Private
const deleteUser = asyncHandler(async (req, res)=> {
  
})

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}