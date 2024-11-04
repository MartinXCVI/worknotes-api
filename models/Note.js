/* We call the Mongoose library that helps with data modeling,
 schema enforcement, and model validation for MongoDB */
const mongoose = require('mongoose')
// Autoincrement plugin for Mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)

 /* Creating our 'user' Schema that 
 allows us to have a data model */
const noteSchema = new mongoose.Schema(
  {
    // Data model:
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
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
noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500
})

// We name our Schema as 'Note' and export it
module.exports = mongoose.model('Note', noteSchema)