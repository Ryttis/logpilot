import fs from 'fs';
import readline from 'readline';
import crypto from 'crypto';
import db from '../../models/index.js';

/**
 * Parse one line of Nginx access log into structured data
 */
function parseLine(line) {
    // Match common Nginx log format
    const match = line.match(
        /^(\S+) \S+ \S+ \[[^\]]+\] "(\S+) ([^"]+) [^"]+" (\d{3}) (\d+)/
    );
    if (!match) return null;

    const [, ip, method, route, status, bytes] = match;
    const route_hash = crypto.createHash('sha1').update(route).digest('hex');

    return {
        ip,
        route,
        route_hash,
        method,
        status: Number(status),
        bytes: Number(bytes),
    };
}

/**
 * Parse a log file line-by-line and insert entries into DB.
 * Automatically skips empty or malformed lines.
 */
export async function parseLogFile(filePath) {
    console.log(`📄 [Parser] Processing file: ${filePath}`);

    const NginxLog = db.NginxLog;
    if (!NginxLog) {
        console.error('❌ [Parser] Model NginxLog not found. Check models/index.js');
        return;
    }

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });

    const buffer = [];
    let lineCount = 0;

    for await (const line of rl) {
        lineCount++;
        const entry = parseLine(line);
        if (entry) buffer.push(entry);
    }

    if (buffer.length === 0) {
        console.log(`⚠️ [Parser] No valid log entries found in ${filePath}`);
        return;
    }

    console.log(`🧮 [Parser] Parsed ${buffer.length} valid entries (${lineCount} total lines)`);

    try {
        await NginxLog.bulkCreate(buffer, { ignoreDuplicates: true });
        console.log(`✅ [Parser] Inserted ${buffer.length} rows into nginx_logs`);
    } catch (err) {
        console.error(`❌ [Parser] DB insert failed for ${filePath}: ${err.message}`);
        console.error(err.stack);
    }
}
