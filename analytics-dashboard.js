class AnalyticsDashboard {
    constructor() {
        this.data = {
            events: LocalStorage.getEvents(),
            tickets: LocalStorage.getTickets(),
            users: LocalStorage.getUsers()
        };
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.renderOverviewStats();
        this.renderCharts();
        this.setupRealTimeUpdates();
    }

    renderOverviewStats() {
        const stats = this.calculateStats();
        document.getElementById('analytics-overview').innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Revenue</h3>
                    <p class="stat-value">$${stats.totalRevenue.toLocaleString()}</p>
                    <span class="trend ${stats.revenueTrend > 0 ? 'up' : 'down'}">
                        ${Math.abs(stats.revenueTrend)}% from last month
                    </span>
                </div>
                <!-- More stat cards -->
            </div>
        `;
    }

    renderCharts() {
        this.renderRevenueChart();
        this.renderAttendanceChart();
        this.renderEventTypeDistribution();
    }
} 