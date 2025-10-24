import express from 'express'
import { register, login, authMiddleware } from '../controllers/auth.controller.js'
import LogController from '../controllers/LogController.js'

const router = express.Router()

router.get('/ping', (req, res) =>
    res.json({ message: 'pong', time: new Date().toISOString() })
)
router.get('/logs', LogController.getLogs)
router.get('/logs/stats', LogController.getLogStats)
router.get('/logs/:ip', LogController.getLogsByIp)

router.post('/auth/register', register)
router.post('/auth/login', login)

router.get('/auth/me', authMiddleware, (req, res) => {
    res.json({ id: req.user.id })
})

export default router
