/* Calling the Mongoose library that helps with data modeling,
 schema enforcement, and model validation for MongoDB */
import mongoose from 'mongoose'

// Async function for the DB connection
const connectDB = async (): Promise<void>=> {
  // Connection string declaration
  const dbUri: string = `${process.env.DATABASE_URI}`
  // Validating connection string
  if(!dbUri) {
    console.error('Database connection string is missing.')
    process.exit(1)
  }
  try {
    await mongoose.connect(dbUri)
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