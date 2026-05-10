import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'users.json')

export function readUsers() {
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, '[]', 'utf-8')
    return []
  }
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
}

export function writeUsers(users) {
  writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8')
}