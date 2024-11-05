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
  // Destructuring the data we'll receive from the frontend
  const { id, username, roles, active, password } = req.body

  // Confirming data
  if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Defining our user
  // Executing the query with exec() to return a promise
  const user = await User.findById(id).exec()

  if(!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Checking for duplicate
  const duplicate = await User.findOne({ username }).lean().exec()

  // Allow updates to the original user
  if(duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  // Updating our user object
  user.username = username
  user.roles = roles
  user.active = active

  if(password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10) // salt rounds
  }

  // Update of our user
  const updatedUser = await user.save()
  res.json({ message: `${updatedUser.username} updated!` })
})

// @description: Delete a user
// @route: /users
// @method: DELETE
// @access: Private
const deleteUser = asyncHandler(async (req, res)=> {
  const { id } = req.body // Only destructuring the id

  if(!id) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  // preventing the deletion of users with assigned notes
  const notes = await Note.findOne({ user: id }).lean().exec()
  if(notes?.length) {
    return res.status(400).json({ message: 'User currently has assigned notes' })
  }

  const user = await User.findById(id).exec()

  if(!user) {
    return res.status(400).json({ message: 'User not found' })
  }
  // The full user object that is deleted
  const result = await user.deleteOne()
  // Delete message
  const reply = `Username ${result.username} with ID ${result.id} has been successfully deleted`
  res.json(reply)
})

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}