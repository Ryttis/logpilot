import { parseLogFile } from '../src/services/LogParserService.js'

await parseLogFile('./logs/test.log', 100)
