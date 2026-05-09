const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

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

export async function sendMessageToGroq(messages, apiKey) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.content }))
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Groq API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}