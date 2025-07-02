import { IUserSchema } from './interfaces/IUserSchema.js'
/* Calling the Mongoose library that helps with data modeling,
 schema enforcement, and model validation for MongoDB */
import mongoose, { Schema, Model } from 'mongoose'


/* Creating the 'user' schema */
const UserSchema = new Schema<IUserSchema>({
  // Data model:
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Array for the *possible* multiple roles in a user
  roles: {
    type: [String],
    default: ["Employee"]
  },
  active: {
    type: Boolean,
    default: true
  }
})

// Creating model and exporting it
const UserModel: Model<IUserSchema> = mongoose.model<IUserSchema>('User', UserSchema)
export default UserModel