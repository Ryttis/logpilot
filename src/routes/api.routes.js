import express from 'express'
import LogController from '../controllers/LogController.js'

const router = express.Router()

router.get('/ping', (req, res) =>
    res.json({ message: 'pong', time: new Date().toISOString() })
)
router.get('/logs', LogController.getLogs)
router.get('/logs/:ip', LogController.getLogsByIp)

export default router
