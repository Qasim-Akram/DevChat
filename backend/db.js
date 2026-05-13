import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)
let db

export async function connectDB() {
    if (db) return db
    await client.connect()
    db = client.db(process.env.DB_NAME || 'devchat')
    console.log('Connected to MongoDB')
    return db
}

export function getDB() {
    if (!db) throw new Error('DB not connected. Call connectDB() first.')
    return db
}