/* We call the Mongoose library that helps with data modeling,
 schema enforcement, and model validation for MongoDB */
const mongoose = require('mongoose')

/* Creating our 'user' Schema that 
allows us to have a data model */
const userSchema = new mongoose.Schema({
  // Data model:
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Users may have more than 1 role so we define it as an array
  roles: [
    {
      type: String,
      default: "Employee"
    }
  ],
  active: {
    type: Boolean,
    default: true
  }
})

// We name our Schema as 'User' and export it
module.exports = mongoose.model('User', userSchema)