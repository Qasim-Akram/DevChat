import express from 'express'
import fetch from 'node-fetch'
import { ObjectId } from 'mongodb'
import { verifyToken } from '../middleware/auth.js'
import { getDB } from '../db.js'

const router = express.Router()

const SYSTEM_PROMPT = `You are DevChat, an expert AI assistant exclusively for developers. You help with:
- Debugging code and fixing errors
- Explaining programming concepts clearly
- Code reviews and best practices
- Architecture and design patterns
- Any programming language or framework

Rules:
- Always format code in proper markdown code blocks with the language specified
- Be concise but thorough
- If someone asks about non-dev topics, politely redirect them to coding questions
- Use technical terminology appropriately
- When showing code examples, make them practical and runnable`

router.post('/', verifyToken, async (req, res) => {
  try {
    const { messages, sessionId } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: 'Messages are required' })

    if (!sessionId)
      return res.status(400).json({ error: 'sessionId is required' })

    const db = getDB()
    const session = await db.collection('sessions').findOne({
      _id: new ObjectId(sessionId),
      userId: req.user.id
    })
    if (!session)
      return res.status(403).json({ error: 'Session not found or access denied' })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || 'Groq API error' })
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    const isFirstMessage = session.messages.length === 0
    const userMsg = messages[messages.length - 1]
    const botMsg = {
      id: crypto.randomUUID(),
      sender: 'bot',
      content,
      timestamp: Date.now()
    }

    const updateOps = {
      $push: { messages: botMsg },
      $set: { updatedAt: new Date() }
    }

    if (isFirstMessage && userMsg?.content) {
      const title = userMsg.content.slice(0, 40) + (userMsg.content.length > 40 ? '...' : '')
      updateOps.$set.title = title
    }

    await db.collection('sessions').updateOne(
      { _id: new ObjectId(sessionId) },
      updateOps
    )

    const updatedTitle = isFirstMessage && userMsg?.content
      ? userMsg.content.slice(0, 40) + (userMsg.content.length > 40 ? '...' : '')
      : session.title

    res.json({ content, botMsg, title: updatedTitle })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router