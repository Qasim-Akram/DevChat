import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import sessionRoutes from './routes/sessions.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/sessions', sessionRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', model: 'llama-3.3-70b-versatile' }))

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DevChat server running on http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(1)
  })