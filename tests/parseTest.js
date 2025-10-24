import { parseLogFile } from '../src/services/LogParserService.js'

await parseLogFile('./logs/access.log', 100)
