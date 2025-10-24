import crypto from 'crypto'

/**
 * --- LogEncodingService ---
 * Compresses and normalizes Nginx log entries for DB storage.
 * Each record is stored with:
 *  - route_hash: short, deterministic identifier for route
 *  - data: base64-encoded JSON payload with metadata
 */

const hashRoute = (route) => {
    // deterministic SHA-1 hash for each route path
    return crypto.createHash('sha1').update(route).digest('hex')
}

/**
 * Encode a parsed log line before saving to DB.
 * @param {Object} entry { ip, route, method, status, bytes }
 * @returns {Object} Encoded object ready for Sequelize.create()
 */
export const encodeLog = (entry) => {
    const payload = {
        method: entry.method,
        status: entry.status,
        bytes: entry.bytes ?? 0,
    }

    return {
        ip: entry.ip,
        route_hash: hashRoute(entry.route),
        data: Buffer.from(JSON.stringify(payload)).toString('base64'),
        method: entry.method,
        status: entry.status,
        bytes: entry.bytes ?? 0,
        created_at: new Date(),
    }
}

/**
 * Decode a stored log record back into readable form.
 * @param {Object} record Sequelize instance or plain object
 * @param {Function} [resolveRoute] optional hash→route resolver
 */
export const decodeLog = (record, resolveRoute = (hash) => hash) => {
    const decoded = JSON.parse(Buffer.from(record.data, 'base64').toString('utf8'))

    return {
        id: record.id,
        ip: record.ip,
        route: resolveRoute(record.route_hash),
        method: decoded.method || record.method,
        status: decoded.status || record.status,
        bytes: decoded.bytes || record.bytes,
        created_at: record.created_at,
    }
}

/**
 * Optional: maintain a lookup cache to resolve route hashes.
 */
const routeCache = new Map()

export const getRouteFromHash = (hash) => routeCache.get(hash) || hash
export const registerRoute = (route) => {
    const hash = hashRoute(route)
    routeCache.set(hash, route)
    return hash
}

export default {
    encodeLog,
    decodeLog,
    hashRoute,
    getRouteFromHash,
    registerRoute,
}
