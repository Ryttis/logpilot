import express from 'express'
import LogController from '../controllers/LogController.js'

const router = express.Router()

router.get('/logs', LogController.getLogs)
router.get('/logs/:ip', LogController.getLogsByIp)

export default router
