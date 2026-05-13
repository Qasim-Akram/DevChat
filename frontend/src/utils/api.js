import { getToken } from './auth.js'

const API_URL = import.meta.env.VITE_API_URL

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }
}

async function handleResponse(res) {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
}

export async function fetchSessions() {
    const res = await fetch(`${API_URL}/api/sessions`, { headers: authHeaders() })
    return handleResponse(res)
}

export async function fetchSession(id) {
    const res = await fetch(`${API_URL}/api/sessions/${id}`, { headers: authHeaders() })
    return handleResponse(res)
}

export async function createSession() {
    const res = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: authHeaders()
    })
    return handleResponse(res)
}

export async function deleteSessionAPI(id) {
    const res = await fetch(`${API_URL}/api/sessions/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    })
    return handleResponse(res)
}

export async function addMessageToSession(sessionId, message) {
    const res = await fetch(`${API_URL}/api/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ message })
    })
    return handleResponse(res)
}

export async function sendChatMessage(messages, sessionId) {
    const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ messages, sessionId })
    })
    return handleResponse(res)
}