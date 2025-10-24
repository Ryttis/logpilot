import fs from 'fs'
import readline from 'readline'
import crypto from 'crypto'
import db from '../../models/index.js'
const { NginxLog } = db
const { RouteMap } = db

/**
 * Parses one line of Nginx access log
 */
function parseLine(line) {
    const match = line.match(
        /^(\S+) \S+ \S+ \[[^\]]+\] "(\S+) ([^"]+) [^"]+" (\d{3}) (\d+)/
    )
    if (!match) return null

    const [, ip, method, route, status, bytes] = match

    const route_hash = crypto.createHash('sha1').update(route).digest('hex')
    const data = JSON.stringify({ method, status: Number(status), bytes: Number(bytes) })

    return { ip, route_hash, data, method, status: Number(status), bytes: Number(bytes) }
}

/**
 * Parse and insert logs
 */
export async function parseLogFile(filePath) {
    console.log(`📄 Parsing ${filePath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    })

    const buffer = []
    for await (const line of rl) {
        const entry = parseLine(line)
        if (entry) buffer.push(entry)
    }

    if (buffer.length === 0) {
        console.log('⚠️ No valid log entries found.')
        return
    }

    // Ensure routes exist in route_map
    const uniqueRoutes = [...new Set(buffer.map(e => e.route_hash))]
    for (const route_hash of uniqueRoutes) {
        const exists = await RouteMap.findOne({ where: { hash: route_hash } })
        if (!exists) await RouteMap.create({ hash: route_hash, route: route_hash })
    }

    // ✅ Remove created_at completely before inserting
    const sanitized = buffer.map(e => {
        const clone = { ...e }
        delete clone.created_at
        return clone
    })

    try {
        await NginxLog.bulkCreate(sanitized, { ignoreDuplicates: true })
        console.log(`✅ Inserted ${sanitized.length} rows into nginx_logs`)
    } catch (err) {
        console.error(`❌ [Worker] Error parsing ${filePath}:`, err.message)
        console.error(err.stack)
    }
}
