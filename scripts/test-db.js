import { db } from '../src/utils/db.js';

const testConnection = async () => {
    try {
        const [rows] = await db.query('SELECT NOW() AS now');
        console.log('✅ Database connected successfully!');
        console.log('Current time:', rows[0].now);
    } catch (err) {
        console.error('❌ Database connection failed:');
        console.error(err.message);
    } finally {
        process.exit();
    }
};

testConnection();
