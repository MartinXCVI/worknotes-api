// Importing Express interfaces
import { Request, Response } from "express"
// Importing custom interfaces
import { ICreateNewNote } from "./interfaces/ICreateNewNote.js"
import { IUpdateNote } from "./interfaces/IUpdateNote.js"
import { IDeleteNote } from "./interfaces/IDeleteNote.js"
// Importing models
import UserModel from "../models/User.model.js"
import NoteModel from "../models/Note.model.js"
/* Importing the Express Async Hanlder for 
handling exceptions inside of async express routes
and passing them to your express error handlers */
import asyncHandler from 'express-async-handler'


/*-- CONTROLLER FUNCTIONS --*/

// @description: Get all notes
// @route: /notes
// @method: GET
// @access: Private
const getAllNotes = asyncHandler(async(req: Request, res: Response): Promise<void> => {
  // Get all notes from the database
  const notes = await NoteModel.find().lean()
  // If there aren't any notes
  if(!notes?.length) {
    res.status(400).json({ message: 'No notes were found' })
    return
  }
  // Adding the username to each note before sending the response
  const notesWithUser = await Promise.all(notes.map(async (note)=> {
    const user = await UserModel.findById(note.user).lean().exec()
    if(!user) {
      return { ...note, username: 'Unknown user' }
    }
    return {...note, username: user.username}
  }))

  res.json(notesWithUser)
  return
})


// @description: Create a new note
// @route: /notes
// @method: POST
// @access: Private
const createNewNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Getting the data from the request's body
  const { user, title, text } = req.body as ICreateNewNote
  // Confirming user data
  if(!user || !title || !text) {
    res.status(400).json({ message: "All fields are required" })
    return
  }
  // Checking for a duplicate title
  const duplicate = await NoteModel.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if(duplicate) {
    res.status(409).json({ message: "Duplicate note title" })
    return
  }
  // Creating and storing the new note
  const note = await NoteModel.create({ user, title, text })
  // Checking if the note exists/got created
  if(note) {
    res.status(201).json({ message: 'New note successfully created' })
    return
  } else {
    res.status(400).json({ message: 'Invalid note data received' })
    return
  }
}) // End of createNewNote controller


// @description: Updating a note
// @route: /notes
// @method: PATCH
// @access: Private
const updateNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Getting the data from the request's body
  const { id, user, title, text, completed } = req.body as IUpdateNote
  // Confirming the data
  if(!id || !user || !title || !text || typeof completed !== 'boolean') {
    res.status(400).json({ message: 'All fields are required' })
    return
  }
  // Confirming that the note to update actually exists
  const note = await NoteModel.findById(id).exec()

  if(!note) {
    res.status(400).json({ message: 'Note does not exist' })
    return
  }
  // Checking for a duplicate title
  const duplicate = await NoteModel.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
  // Allowing renaming of the origin note
  if(duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: 'Duplicate note title' })
    return
  }
  // Updating our note object
  note.user = user
  note.title = title
  note.text = text
  note.completed = completed
  // Update of the note
  const updatedNote = await note.save()
  res.json(`'${updatedNote.title}' has been updated`)
  return
}) // End of updateNote controller


// @description: Deleting a note
// @route: /notes
// @method: DELETE
// @access: Private
const deleteNote = asyncHandler(async (req, res): Promise<void> => {
  const { id } = req.body as IDeleteNote // Only destructuring the id

  if(!id) {
    res.status(400).json({ message: 'Note ID is required' })
  }
  // Checking if the note to be deleted exists
  const note = await NoteModel.findById(id).exec()

  if(!note) {
    res.status(400).json({ message: 'Note not found' })
    return
  }
  // Extracting necessary data before deletion
  const { title, _id } = note
  // The full note object to be deleted
  await note.deleteOne()
  // Delete message with the extracted data before deletion
  res.json({ message: `Note '${title}' with ID ${_id} has been successfully deleted` })
  return
}) // End of deleteNote controller


export default {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote
}