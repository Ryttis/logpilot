import { db } from '../utils/db.js';

export const PromptsService = {
    async create({ userId, prompt_text, result_text }) {
        const [result] = await db.query(
            'INSERT INTO prompts (user_id, prompt_text, result_text) VALUES (?, ?, ?)',
            [userId, prompt_text, result_text]
        );
        return { id: result.insertId, prompt_text, result_text };
    },

    async list() {
        const [rows] = await db.query('SELECT * FROM prompts ORDER BY created_at DESC');
        return rows;
    }
};
