import { INoteSchema } from './interfaces/INoteSchema.js'
/* Calling the Mongoose library that helps with data modeling,
 schema enforcement, and model validation for MongoDB */
import mongoose, { Schema, Model } from 'mongoose'
// Autoincrement plugin for Mongoose  
import mongooseSequence from 'mongoose-sequence'

const AutoIncrementPlugin = (mongooseSequence as any)(mongoose)

/* Creating the 'note' schema */
const NoteSchema = new Schema<INoteSchema>(
  {
    // Data model:
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Refering back to the 'User' Schema
    },
    title: {
      type:String,
      required: true
    },
    // Users may have more than 1 role so we define it as an array
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    // We get access to createdAt and updatedAt timestamps
    timestamps: true
  }
)

// Autoincrement functionalities
NoteSchema.plugin(AutoIncrementPlugin, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500
})

// Creating model and exporting it
const NoteModel: Model<INoteSchema> = mongoose.model<INoteSchema>('Note', NoteSchema)
export default NoteModel