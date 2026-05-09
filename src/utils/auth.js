const SECRET = 'devchat_secret_key_2025'

function base64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function createToken(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify({ ...payload, iat: Date.now() }))
  const signature = base64url(`${header}.${body}.${SECRET}`)
  return `${header}.${body}.${signature}`
}

function decodeToken(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload
  } catch {
    return null
  }
}

const USERS_KEY = 'devchat_users'
const TOKEN_KEY = 'devchat_token'

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signup(username, email, password) {
  const users = getUsers()
  if (users.find(u => u.email === email)) {
    throw new Error('Email already registered')
  }
  const user = { id: crypto.randomUUID(), username, email, password, createdAt: Date.now() }
  saveUsers([...users, user])
  const token = createToken({ id: user.id, username: user.username, email: user.email })
  localStorage.setItem(TOKEN_KEY, token)
  return { id: user.id, username: user.username, email: user.email }
}

export function login(email, password) {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  const token = createToken({ id: user.id, username: user.username, email: user.email })
  localStorage.setItem(TOKEN_KEY, token)
  return { id: user.id, username: user.username, email: user.email }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getCurrentUser() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  return decodeToken(token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}