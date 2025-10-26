import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.data("logDashboard", () => ({
    stats: [],
    chart: null,

    async loadStats() {
        try {
            const res = await fetch("http://localhost:3000/api/logs");
            const json = await res.json();
            this.stats = json.data || [];
        } catch (err) {
            console.error("Failed to load stats:", err);
        }

        setTimeout(() => this.loadStats(), 30000);
    },
}));

Alpine.start();
