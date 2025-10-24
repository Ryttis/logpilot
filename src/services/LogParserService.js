import fs from 'fs'
import readline from 'readline'
import { encodeLog } from './LogEncodingService.js'
import db from '../../models/index.js'

const { NginxLog } = db

/**
 * --- LogParserService ---
 * Parses large Nginx log files using Node streams to avoid high memory use.
 * Each line is matched with a regex and encoded before DB insert.
 */

/** Regex pattern for standard Nginx combined log format */
const nginxPattern = /^(\S+) - - \[.*?\] "(GET|POST|PUT|DELETE|HEAD) ([^"]*?) HTTP\/[0-9.]+" (\d{3}) (\d+)/

/**
 * Parse a single log line.
 * @param {string} line
 * @returns {object|null}
 */
function parseLine(line) {
    const m = nginxPattern.exec(line)
    if (!m) return null
    const [_, ip, method, route, status, bytes] = m
    return { ip, method, route, status: Number(status), bytes: Number(bytes) }
}

/**
 * Stream a file and insert entries in batches.
 * @param {string} filePath
 * @param {number} batchSize
 */
export async function parseLogFile(filePath, batchSize = 1000) {
    console.log(`📄 Parsing ${filePath}`)

    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    const buffer = []
    let lineCount = 0

    for await (const line of rl) {
        const parsed = parseLine(line)
        if (parsed) {
            buffer.push(encodeLog(parsed))
            if (buffer.length >= batchSize) {
                await NginxLog.bulkCreate(buffer, { ignoreDuplicates: true })
                buffer.length = 0
            }
            lineCount++
        }
    }

    if (buffer.length) {
        await NginxLog.bulkCreate(buffer, { ignoreDuplicates: true })
    }

    console.log(`✅ Completed ${filePath} — ${lineCount.toLocaleString()} lines processed`)
}

/**
 * Parse all files in a folder (used by worker/cron job)
 * @param {string} folderPath
 */
export async function parseAllLogs(folderPath) {
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.log'))
    for (const f of files) {
        await parseLogFile(`${folderPath}/${f}`)
    }
}
