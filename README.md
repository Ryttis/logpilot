Perfect 👍 — here’s the entire content of your final README.md (plain text, ready to copy & paste directly).
You can select everything below and paste it into your /logpilot/README.md file — it will render correctly on GitHub.

## 🧠 LogPilot — Real-Time Nginx Log Analytics

LogPilot is a lightweight full-stack system for collecting, parsing, and analyzing Nginx access logs.
It combines Node.js + Express + MySQL + Sequelize on the backend with a Vite + Alpine.js + TailwindCSS dashboard frontend.

## 🚀 Features

Stream-based Nginx log parser (handles 1M+ lines efficiently)

Automatic route hashing + mapping for secure storage

Worker/Scheduler scans and ingests logs periodically

REST API for logs and statistics:

/api/logs – list logs

/api/logs/:ip – logs by IP

/api/logs/stats – aggregated hits by IP & route

Frontend dashboard with:

Real-time chart of top IPs

Refreshable table of routes & hits

Configurable log directory via .env

One-command dev environment (npm run up)

Production-ready build served from client/dist

## 🏗️ System Architecture

Alpine.js (Vite + Tailwind + Chart.js)
↓ REST API
Express backend (Node.js + Sequelize)
↓
MySQL database (nginx_logs, route_map)
↓
Worker Scheduler (node-cron)

⚙️ How It Works

Scheduler runs every 5 minutes → scans the folder defined in LOG_DIR for new or updated .log files.

LogParserService reads each line, extracts fields, hashes the route, encodes the payload, and saves it.

API provides access endpoints to retrieve or aggregate stored logs.

Frontend dashboard fetches /api/logs/stats, displays charts and tables, and auto-refreshes every 30s.

## 🧩 Tech Stack

Backend: Node.js · Express · Sequelize
Database: MySQL
Frontend: Vite · Alpine.js · TailwindCSS · Chart.js
Scheduler: node-cron
Utilities: dotenv · concurrently · nodemon

## 🛠️ Installation (Development)

1️⃣ Clone the repository:

git clone https://github.com/yourname/logpilot.git
cd logpilot


2️⃣ Install dependencies:

npm install
cd client && npm install && cd ..


3️⃣ Create .env in the root:

LOG_DIR=./logs
PORT=3000
NODE_ENV=development
DB_USER=root
DB_PASS=yourpassword
DB_NAME=logpilot
DB_HOST=127.0.0.1

## 🧰 Running in Development

To start everything (backend + frontend + worker):

npm run up


Or individually:

npm run dev      # API only
npm run client   # frontend only (Vite)
npm run worker   # background ingestion


Access points:

API → http://localhost:3000/api/logs

Frontend → http://localhost:5173

## 🧱 Building for Production

1️⃣ Build frontend:

npm run build


2️⃣ Run in production:

NODE_ENV=production npm start


Express will serve the built dashboard at http://localhost:3000

3️⃣ Optionally run API + worker together:

npm run all

## 🧩 Database Setup

Apply migrations:

npm run migrate


Reset database:

npm run reset

🔄 Log Storage & Decoding

Logs are encoded (Base64) and linked by route_hash.

Table route_map stores hash → readable route mapping.

API decodes and resolves routes before returning to frontend.

⚙️ Environment Variables

LOG_DIR – path to Nginx logs folder
PORT – web server port
NODE_ENV – environment (development/production)
DB_USER / DB_PASS / DB_NAME / DB_HOST – MySQL connection settings

## 📦 Folder Structure
logpilot/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ controllers/
│  ├─ services/
│  ├─ workers/
├─ models/
├─ db/migrations/
├─ client/
├─ logs/
└─ .env

## 🧠 Example Workflow

Copy your access.log files into ./logs/

Worker parses them automatically every 5 minutes

Data stored in MySQL (nginx_logs)

Dashboard visualizes routes and IP stats

🚢 Production Checklist

✅ Build frontend – npm run build
✅ Set NODE_ENV=production
✅ Start – npm start or npm run all
✅ Migrate DB – npm run migrate
✅ Configure .env (database + log path)


## 🧑‍💻 Example API Calls

List recent logs:

curl http://localhost:3000/api/logs?limit=10 | jq


Show statistics:

curl http://localhost:3000/api/logs/stats | jq

💡 Future Improvements

Incremental parsing (only new lines)

Multiple log sources

Role-based access/authentication

Docker Compose full-stack deployment

Ingestion performance metrics

🧾 License

MIT License — free for personal or commercial use.