// Importing Express interfaces
import { Request, Response } from "express"
// Importing custom interfaces
import { IUpdateUser } from "./interfaces/IUpdateUser.js"
import { ICreateNewUser } from "./interfaces/ICreateNewUser.js"
import { IDeleteUser } from "./interfaces/IDeleteUser.js"
// Importing models
import UserModel from "../models/User.model.js"
import NoteModel from "../models/Note.model.js"
/* Importing the Express Async Hanlder for 
handling exceptions inside of async express routes
and passing them to your express error handlers */
import asyncHandler from 'express-async-handler'
// Requiring the Bcrypt library to hash passwords
import bcrypt from 'bcrypt'


/*-- CONTROLLER FUNCTIONS --*/


// @description: Get all users
// @route: /users
// @method: GET
// @access: Private
const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // We prevent the password to be sent back to the client
  // lean() method to return JSON instead of a Mongoose document
  const users = await UserModel.find().select('-password').lean()
  if(!users?.length) {
    res.status(400).json({ message: 'No users found' })
    return
  }
  res.status(200).json(users)
  return
}) // End of getAllUsers controller


// @description: Create new user
// @route: /users
// @method: POST
// @access: Private
const createNewUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Destructuring data received in the request's body
  const { username, password, roles } = req.body as ICreateNewUser
  // Confirming data
  if(!username || !password) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }
  // Checking for duplicates
  // Mongoose exec() will execute the query and return a Promise
  const duplicate = await UserModel.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if(duplicate) {
    res.status(409).json({ message: 'Duplicated username' })
    return
  }
  // Hashing the password
  const hashedPass = await bcrypt.hash(password, 10) // salt rounds
  // Creating the user object
  const userObject = (!Array.isArray(roles) || !roles.length)
    ? { username, "password": hashedPass }
    : { username, "password": hashedPass, roles }
  // Creating and storing a new user
  const user = await UserModel.create(userObject)
  // if created
  if(user) {
    res.status(201).json({ message: `New user ${username} has been created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
  return
}) // End of createNewUser


// @description: Update a user
// @route: /users
// @method: PATCH
// @access: Private
const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Destructuring data received in the request's body
  const { id, username, roles, active, password } = req.body as IUpdateUser
  // Confirming data
  if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    res.status(400).json({ message: "All fields are required" })
    return
  }

  /* Defining user */
  // Executing the query with exec() to return a promise
  const user = await UserModel.findById(id).exec()

  if(!user) {
    res.status(400).json({ message: 'User not found' })
    return
  }
  // Checking for duplicate
  const duplicate = await UserModel.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
  // Allow updates to the original user
  if(duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: 'Duplicate username' })
    return
  }
  // Updating the user object
  user.username = username
  user.roles = roles
  user.active = active
  // Password hashing
  if(password) {
    user.password = await bcrypt.hash(password, 10) // salt rounds
  }
  // Updating user
  const updatedUser = await user.save()
  res.json({ message: `${updatedUser.username} updated!` })
  return
}) // End of updateUser controller


// @description: Delete a user
// @route: /users
// @method: DELETE
// @access: Private
const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.body as IDeleteUser // Only destructuring the id

  if(!id) {
    res.status(400).json({ message: 'User ID is required' })
    return
  }
  // Preventing the deletion of users with assigned notes
  const note = await NoteModel.findOne({ user: id }).lean().exec()
  if(note) {
    res.status(400).json({ message: 'User currently has assigned notes' })
    return
  }
  // Checking if the user to be deleted exists
  const user = await UserModel.findById(id).exec()

  if(!user) {
    res.status(400).json({ message: 'User not found' })
    return
  }
  // Extracting necessary data before deletion
  const { username, _id } = user
  // The full user object that is deleted
  await user.deleteOne()
  // Delete message with the extracted data before deletion
  res.json({ message: `Username ${username} with ID ${_id} has been successfully deleted` })
  return
}) // End of deleteUser controller


export default {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}