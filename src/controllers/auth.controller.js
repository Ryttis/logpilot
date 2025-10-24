import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../../models/index.js'

const { User } = db
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username, email, and password are required' })
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({
            username,
            email,
            password_hash: hashed,
        })

        res.json({ id: user.id, email: user.email, username: user.username })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(401).json({ error: 'Invalid credentials' })

        const match = await bcrypt.compare(password, user.password_hash)
        if (!match) return res.status(401).json({ error: 'Invalid credentials' })

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })
        res.json({ token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) return res.status(401).json({ error: 'Missing token' })
    try {
        const token = header.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ error: 'Invalid token' })
    }
}
