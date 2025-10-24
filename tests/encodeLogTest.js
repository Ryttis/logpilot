// tests/encodeLogTest.js
import { encodeLog, decodeLog } from '../src/services/LogEncodingService.js'

const sample = {
    ip: '192.168.0.1',
    route: '/api/test',
    method: 'GET',
    status: 200,
    bytes: 1234
}

const encoded = encodeLog(sample)
console.log('--- ENCODED ---')
console.log(encoded)

const decoded = decodeLog(encoded, (hash) => '/api/test')
console.log('--- DECODED ---')
console.log(decoded)
