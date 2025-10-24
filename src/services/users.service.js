import bcrypt from 'bcrypt';
import { db } from '../utils/db.js';

export const UsersService = {
    async create({ username, password }) {
        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [username, passwordHash]
        );
        return { id: result.insertId, username };
    },
};
