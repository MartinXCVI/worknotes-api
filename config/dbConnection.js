/* We call the Mongoose library that helps with data modeling,
 schema enforcement, and model validation for MongoDB */
const mongoose = require('mongoose')

// Async function for the DB connection
const connectDB = async ()=> {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
  } catch(error) {
    console.error(error)
  }
}

module.exports = connectDB