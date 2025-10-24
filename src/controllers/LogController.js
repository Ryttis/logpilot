import db from '../../models/index.js'
import { decodeLog } from '../services/LogEncodingService.js'

const { NginxLog, Sequelize } = db
const { Op } = Sequelize

/**
 * GET /api/logs
 * ?ip=1.2.3.4&route_hash=abc&page=1&limit=100
 */
export async function getLogs(req, res) {
    try {
        const { ip, route_hash, page = 1, limit = 100 } = req.query
        const where = {}
        if (ip) where.ip = ip
        if (route_hash) where.route_hash = route_hash

        const offset = (page - 1) * limit

        const logs = await NginxLog.findAll({
            where,
            order: [['created_at', 'DESC']],
            limit: Number(limit),
            offset: Number(offset)
        })

        const decoded = logs.map(log => decodeLog(log))
        res.json({ count: decoded.length, data: decoded })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch logs' })
    }
}

/**
 * GET /api/logs/stats
 * Aggregated hits by IP and route_hash
 */
export async function getLogStats(req, res) {
    try {
        const stats = await NginxLog.findAll({
            attributes: [
                'ip',
                'route_hash',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'hits']
            ],
            group: ['ip', 'route_hash'],
            order: [[Sequelize.literal('hits'), 'DESC']],
            limit: 100
        })

        const routeMap = await db.RouteMap.findAll()
        const routeDict = Object.fromEntries(routeMap.map(r => [r.hash, r.route]))

        const readable = stats.map(s => ({
            ip: s.ip,
            route: routeDict[s.route_hash] || `[${s.route_hash.slice(0, 6)}…]`,
            hits: s.dataValues.hits
        }))

        res.json({ count: readable.length, data: readable })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch stats' })
    }
}

/**
 * GET /api/logs/:ip
 * Detailed logs for one IP
 */
export async function getLogsByIp(req, res) {
    try {
        const { ip } = req.params
        const logs = await NginxLog.findAll({
            where: { ip },
            order: [['created_at', 'DESC']],
            limit: 500
        })
        const decoded = logs.map(log => decodeLog(log))
        res.json({ ip, count: decoded.length, data: decoded })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch logs for IP' })
    }
}

export default { getLogs, getLogStats, getLogsByIp }
