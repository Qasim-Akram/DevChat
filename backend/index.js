import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', model: 'llama-3.3-70b-versatile' }))

app.listen(PORT, () => {
  console.log(`DevChat server running on http://localhost:${PORT}`)
})