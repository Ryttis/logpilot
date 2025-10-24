import Alpine from "alpinejs"
import Chart from "chart.js/auto"

window.Alpine = Alpine

// Define Alpine component BEFORE Alpine.start()
Alpine.data("logDashboard", () => ({
    stats: [],
    chart: null,

    async loadStats() {
        try {
            const res = await fetch("http://localhost:3000/api/logs/stats")
            const json = await res.json()
            this.stats = json.data
            this.renderChart()
        } catch (err) {
            console.error("Failed to load stats:", err)
        }

        // Auto-refresh every 30s
        setTimeout(() => this.loadStats(), 30000)
    },

    renderChart() {
        const ctx = document.getElementById("statsChart").getContext("2d")
        const labels = this.stats.slice(0, 10).map(r => r.ip)
        const data = this.stats.slice(0, 10).map(r => r.hits)

        if (this.chart) this.chart.destroy()

        this.chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Hits per IP",
                    data,
                    backgroundColor: "rgba(59,130,246,0.5)",
                    borderColor: "rgb(37,99,235)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } }
            }
        })
    }
}))

Alpine.start()
