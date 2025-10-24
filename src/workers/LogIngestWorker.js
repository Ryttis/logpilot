// src/workers/LogIngestWorker.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseLogFile } from '../services/LogParserService.js'
import db from '../../models/index.js'

// Resolve current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Always load from env or default
const LOG_DIR = process.env.LOG_DIR || path.resolve(__dirname, '../../logs')
const STATE_FILE = path.join(LOG_DIR, '.processed.json')

/**
 * Loads processed state.
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
 * Saves updated state.
 */
function saveState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

/**
 * Parses only new or modified logs.
 */
export async function ingestLogs() {
    console.log(`🧾 [Worker] Checking logs in ${LOG_DIR}`)
    const state = loadState()
    const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.log'))

    for (const filename of files) {
        const filePath = path.join(LOG_DIR, filename)
        const stats = fs.statSync(filePath)
        const mtime = stats.mtimeMs
        const lastProcessed = state[filename] || 0

        if (mtime > lastProcessed) {
            console.log(`🚀 [Worker] New or updated log: ${filename}`)
            try {
                await db.sequelize.authenticate()
                await parseLogFile(filePath)
                state[filename] = mtime
            } catch (err) {
                console.error(`❌ [Worker] Error parsing ${filename}:`, err)
            }
        } else {
            console.log(`⏭️ [Worker] Skipping ${filename} (no changes)`)
        }
    }

    saveState(state)
    console.log('✅ [Worker] Ingestion cycle complete.')
}

if (import.meta.url === `file://${process.argv[1]}`) {
    ingestLogs().then(() => process.exit(0))
}
