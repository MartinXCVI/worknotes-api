// Requiring our models
const User = require('../models/User')
const Note = require('../models/Note')

/* Requiring the Express Async Hanlder for 
handling exceptions inside of async express routes
and passing them to your express error handlers */
const asyncHandler = require('express-async-handler')

/*-- CONTROLLER FUNCTIONS --*/

// @description: Get all notes
// @route: /notes
// @method: GET
// @access: Private
const getAllNotes = asyncHandler(async(req, res)=> {
  // Get all notes from the database
  const notes = await Note.find().lean()
  // If there aren't any notes
  if(!notes?.length) {
    return res.status(400).json({ message: 'No notes were found' })
  }

  // Adding the username to each note before sending the response
  const notesWithUser = await Promise.all(notes.map(async (note)=> {
    const user = await User.findById(note.user).lean().exec()
    return {...note, username: user.username}
  }))

  res.json(notesWithUser)
})

// @description: Create a new note
// @route: /notes
// @method: POST
// @access: Private
const createNewNote = asyncHandler(async (req, res)=> {
  const { user, title, text } = req.body

  // Confirming user data
  if(!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Checking for a duplicate title
  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if(duplicate) {
    return res.status(409).json({ message: "Duplicate note title" })
  }

  // Creating and storing the new note
  const note = await Note.create({ user, title, text })

  if(note) { // Checking if the note exists/got created
    return res.status(201).json({ message: 'New note successfully created' })
  } else {
    return res.status(400).json({ message: 'Invalid note data received' })
  }

})

// @description: Updating a note
// @route: /notes
// @method: PATCH
// @access: Private
const updateNote = asyncHandler(async (req, res)=> {
  const { id, user, title, text, completed } = req.body

  // Confirming the data
  if(!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Confirming that the note to update actually exists
  const note = await Note.findById(id).exec()

  if(!note) {
    return res.status(400).json({ message: 'Note does not exist' })
  }

  // Checking for a duplicate title
  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

  // Allowing renaming of the origin note
  if(duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }

  // Updating our note object
  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  // Update of the note
  const updatedNote = await note.save()
  res.json(`'${updatedNote.title}' has been updated`)
})

// @description: Deleting a note
// @route: /notes
// @method: DELETE
// @access: Private
const deleteNote = asyncHandler(async (req, res)=> {
  const { id } = req.body // Only destructuring the id

  if(!id) {
    res.status(400).json({ message: 'Note ID is required' })
  }

  // Checking if the note to be deleted exists
  const note = await Note.findById(id).exec()

  if(!note) {
    res.status(400).json({ message: 'Note not found' })
  }

  // Extracting necessary data before deletion
  const { title, _id } = note

  // The full note object that is deleted
  await note.deleteOne()

  // Delete message with the extracted data before deletion
  const reply = `Note ${note.title} with ID ${note._id} has been successfully deleted`
  res.json({ message: reply })
})

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote
}