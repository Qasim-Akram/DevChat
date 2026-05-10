import express from 'express'
import fetch from 'node-fetch'
import { verifyToken } from '../middleware/auth.js'

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
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' })
    }

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
    res.json({ content })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router