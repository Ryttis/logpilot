// src/controllers/LogController.js
import db from '../../models/index.js';
const { NginxLog, Sequelize } = db;
const { Op } = Sequelize;

/**
 * GET /api/logs
 * Query parameters:
 *   ?ip=1.2.3.4&route=home&method=GET&status=200&page=1&limit=100
 */
export async function getLogs(req, res) {
    try {
        const {
            ip,
            route,
            method,
            status,
            bytes_min,
            bytes_max,
            since,
            until,
            page = 1,
            limit = 100,
        } = req.query;

        const where = {};

        // Filters
        if (ip) where.ip = ip;
        if (route) where.route = { [Op.like]: `%${route}%` };
        if (method) where.method = method.toUpperCase();
        if (status) where.status = Number(status);
        if (bytes_min || bytes_max) {
            where.bytes = {};
            if (bytes_min) where.bytes[Op.gte] = Number(bytes_min);
            if (bytes_max) where.bytes[Op.lte] = Number(bytes_max);
        }
        if (since || until) {
            where.created_at = {};
            if (since) where.created_at[Op.gte] = new Date(since);
            if (until) where.created_at[Op.lte] = new Date(until);
        }

        const offset = (Number(page) - 1) * Number(limit);

        // Sort by IP asc, then route asc, then newest timestamp
        const logs = await NginxLog.findAndCountAll({
            where,
            order: [
                ['ip', 'ASC'],
                ['route', 'ASC'],
                ['created_at', 'DESC'],
            ],
            limit: Number(limit),
            offset,
            attributes: ['ip', 'route', 'method', 'status', 'bytes', 'created_at'],
        });

        res.json({
            page: Number(page),
            limit: Number(limit),
            total: logs.count,
            data: logs.rows,
        });
    } catch (err) {
        console.error('❌ [API] getLogs failed:', err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
}

/**
 * GET /api/logs/:ip
 * Returns logs for a specific IP sorted by route asc.
 */
export async function getLogsByIp(req, res) {
    try {
        const { ip } = req.params;
        const { limit = 500 } = req.query;

        if (!ip) return res.status(400).json({ error: 'IP is required' });

        const logs = await NginxLog.findAll({
            where: { ip },
            order: [
                ['route', 'ASC'],
                ['created_at', 'DESC'],
            ],
            limit: Number(limit),
            attributes: ['ip', 'route', 'method', 'status', 'bytes', 'created_at'],
        });

        res.json({
            ip,
            count: logs.length,
            data: logs,
        });
    } catch (err) {
        console.error('❌ [API] getLogsByIp failed:', err);
        res.status(500).json({ error: 'Failed to fetch logs for IP' });
    }
}

export default { getLogs, getLogsByIp };
