import fs from 'fs'
import path from 'path'
import { parseLogFile } from '../services/LogParserService.js'

const LOG_DIR = process.env.LOG_DIR || './logs'
const STATE_FILE = path.resolve('./logs/.processed.json')

/**
 * Loads state file of already processed log timestamps.
 */
function loadState() {
    if (!fs.existsSync(STATE_FILE)) return {}
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
    } catch {
        return {}
    }
}

/**
 * Saves updated state to disk.
 */
function saveState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

/**
 * Detects new or updated .log files in /logs and parses them.
 */
export async function ingestLogs() {
    const state = loadState()
    const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.log'))

    for (const filename of files) {
        const filePath = path.join(LOG_DIR, filename)
        const stats = fs.statSync(filePath)
        const mtime = stats.mtimeMs
        const lastProcessed = state[filename] || 0

        if (mtime > lastProcessed) {
            console.log(`🚀 [Worker] New or updated log: ${filename}`)
            await parseLogFile(filePath)
            state[filename] = mtime
        } else {
            console.log(`⏭️ [Worker] Skipping ${filename} (no changes)`)
        }
    }

    saveState(state)
    console.log('✅ [Worker] Ingestion cycle complete.')
}
