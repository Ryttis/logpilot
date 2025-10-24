import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

if (NODE_ENV === 'production') {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    app.use(express.static(path.join(__dirname, '../client/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${NODE_ENV}]`)
})
