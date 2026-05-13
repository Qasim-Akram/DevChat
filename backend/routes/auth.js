import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDB } from '../db.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields are required' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const db = getDB()
    const existing = await db.collection('users').findOne({ email })
    if (existing)
      return res.status(409).json({ error: 'Email already registered' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    }

    const result = await db.collection('users').insertOne(user)
    const userId = result.insertedId.toString()

    const token = jwt.sign(
      { id: userId, username, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: { id: userId, username, email }
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    const db = getDB()
    const user = await db.collection('users').findOne({ email })
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password' })

    const userId = user._id.toString()
    const token = jwt.sign(
      { id: userId, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: userId, username: user.username, email: user.email }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router