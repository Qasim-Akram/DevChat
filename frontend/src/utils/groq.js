import { getToken } from './auth.js'

const API_URL = import.meta.env.VITE_API_URL

export async function sendMessage(messages) {
  const token = getToken()
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ messages })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Server error')
  return data.content
}