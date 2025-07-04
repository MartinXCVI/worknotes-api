// Importing main allowed origin
import { CLIENT_URL } from "./env.js"

const allowedOrigins: string[] = [
  CLIENT_URL,
]

export { allowedOrigins }