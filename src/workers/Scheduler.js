import cron from 'node-cron'
import { ingestLogs } from './LogIngestWorker.js'

console.log('🕓 LogPilot Scheduler started. Checking logs every 5 minutes...')

cron.schedule('*/5 * * * *', async () => {
    try {
        await ingestLogs()
    } catch (err) {
        console.error('❌ Ingestion error:', err)
    }
})

// Optional: run immediately on start
await ingestLogs()
