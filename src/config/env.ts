import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT_ENV: z.string(),
  DATABASE_URI: z.string().url(),
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  CLIENT_URL: z.string().url(),
})

const parsed = envSchema.safeParse(process.env)

if(!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format())
  process.exit(1)
}

const env = parsed.data

export const {
  NODE_ENV,
  PORT_ENV,
  DATABASE_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  CLIENT_URL,
} = env
