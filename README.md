# 🧭 LogPilot

**LogPilot** is a full-stack JavaScript application for parsing, storing, and visualizing massive Nginx log data.  
It can efficiently handle **300 log files (1M+ lines each)**, store structured results in a SQL database, and provide an API & web dashboard for analytics.

---

## 🚀 Features

- 🧩 **Nginx Log Parser**
    - Parses raw Nginx access logs (1M+ lines/file)
    - Extracts: IP, method, route, status, bytes, timestamp
- 💾 **Database Storage**
    - Uses Sequelize ORM with MySQL or SQLite
    - Schema: `nginx_logs` table with efficient indexes
- ⚙️ **REST API**
    - `/api/logs` — fetch logs (filter by IP, route, method, status)
    - `/api/logs/:ip` — detailed logs for one IP
- 📊 **Dashboard**
    - Alpine.js + Chart.js + TailwindCSS frontend (via Vite)
    - Displays top routes, IPs, and real-time updates
- 🧵 **Worker**
    - Background parser scans `/logs` directory periodically
    - Imports new data into the DB

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, Sequelize |
| Database | MySQL  |
| Frontend | Vite, Alpine.js, TailwindCSS |
| Scheduler | Node cron / setInterval worker |
| Language | JavaScript (ESM modules) |

---

## ⚙️ Installation

### Clone and enter project

```
git clone https://github.com/yourname/logpilot.git
cd logpilot
cp .env.example .env
npm install
npm run migrate
```
please adjust .env according local environment
## 🧩 Project Launching
- Backend
```
npm run up
```
- Frontend

```
cd client
npm run dev
```
### This will:

- Start Express API on http://localhost:3000

- Start Log Ingestion Worker (watches /logs)

- Start front dashboard on http://localhost:5173