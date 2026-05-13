import express from 'express'
import { ObjectId } from 'mongodb'
import { getDB } from '../db.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const db = getDB()
        const sessions = await db
            .collection('sessions')
            .find({ userId: req.user.id }, { projection: { messages: 0 } })
            .sort({ updatedAt: -1 })
            .toArray()

        res.json(sessions.map(s => ({
            id: s._id.toString(),
            title: s.title,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
        })))
    } catch (err) {
        console.error('Get sessions error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const db = getDB()
        const session = await db.collection('sessions').findOne({
            _id: new ObjectId(req.params.id),
            userId: req.user.id
        })

        if (!session)
            return res.status(404).json({ error: 'Session not found' })

        res.json({
            id: session._id.toString(),
            title: session.title,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            messages: session.messages || []
        })
    } catch (err) {
        console.error('Get session error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', verifyToken, async (req, res) => {
    try {
        const db = getDB()
        const now = new Date()
        const result = await db.collection('sessions').insertOne({
            userId: req.user.id,
            title: 'New Chat',
            messages: [],
            createdAt: now,
            updatedAt: now
        })

        res.status(201).json({
            id: result.insertedId.toString(),
            title: 'New Chat',
            createdAt: now,
            updatedAt: now,
            messages: []
        })
    } catch (err) {
        console.error('Create session error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { title } = req.body
        const db = getDB()

        const result = await db.collection('sessions').findOneAndUpdate(
            { _id: new ObjectId(req.params.id), userId: req.user.id },
            { $set: { title, updatedAt: new Date() } },
            { returnDocument: 'after' }
        )

        if (!result)
            return res.status(404).json({ error: 'Session not found' })

        res.json({ id: result._id.toString(), title: result.title })
    } catch (err) {
        console.error('Update session error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const db = getDB()
        const result = await db.collection('sessions').deleteOne({
            _id: new ObjectId(req.params.id),
            userId: req.user.id
        })

        if (result.deletedCount === 0)
            return res.status(404).json({ error: 'Session not found' })

        res.json({ success: true })
    } catch (err) {
        console.error('Delete session error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/:id/messages', verifyToken, async (req, res) => {
    try {
        const { message } = req.body 
        const db = getDB()

        const result = await db.collection('sessions').findOneAndUpdate(
            { _id: new ObjectId(req.params.id), userId: req.user.id },
            {
                $push: { messages: message },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after' }
        )

        if (!result)
            return res.status(404).json({ error: 'Session not found' })

        res.json({ success: true })
    } catch (err) {
        console.error('Add message error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router