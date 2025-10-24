import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationPath = path.resolve(__dirname, '../db/migrations/001_init.sql');

const sql = fs.readFileSync(migrationPath, 'utf-8');

const migrate = async () => {
    try {
        await db.query(sql);
        console.log('✅ Migration applied successfully.');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        process.exit();
    }
};

migrate();
