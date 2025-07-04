// Importing connection string
import { DATABASE_URI } from './env.js'
/* Calling the Mongoose library that helps with data modeling,
 schema enforcement, and model validation for MongoDB */
import mongoose from 'mongoose'


// Async function for the DB connection
const connectDB = async (): Promise<void>=> {
  // Validating connection string
  if(!DATABASE_URI) {
    console.error('Database connection string is missing.')
    process.exit(1)
  }
  try {
    await mongoose.connect(DATABASE_URI)
    console.log('Database connection attempt successfully executed')
  } catch(error: unknown) {
    if(error instanceof Error) {
      console.error(`Internal server error while attempting to execute the database connection: ${error.message || error}`)
    } else {
      console.error(`Internal server error while attempting to execute the database connection: ${error}`)
    }
  }
}

export default connectDB