import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Sequelize from 'sequelize'
import mysql2 from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = process.env.NODE_ENV || 'development'
const configPath = path.resolve(__dirname, '../config/config.json')
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))[env]

let sequelize
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        ...config,
        dialectModule: mysql2,
    })
}

const db = {}

for (const file of fs.readdirSync(__dirname)) {
    if (
        file.indexOf('.') !== 0 &&
        file !== path.basename(__filename) &&
        file.endsWith('.js') &&
        !file.endsWith('.test.js')
    ) {
        const { default: modelFactory } = await import(path.join(__dirname, file))
        const model = modelFactory(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    }
}

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) db[modelName].associate(db)
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
