class HappeningsManager {
    constructor() {
        this.initializeHappenings();
        this.bindEvents();
    }

    initializeHappenings() {
        this.updateHappenings();
        // Initial state - show weekly
        this.toggleHappenings('weekly');
    }

    bindEvents() {
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.parentElement.id.split('-')[0];
                this.toggleHappenings(category);
            });
        });
    }

    updateHappenings() {
        const events = LocalStorage.getEvents();
        const now = new Date();

        const categorizedEvents = {
            weekly: [],
            monthly: [],
            yearly: []
        };

        events.forEach(event => {
            const eventDate = new Date(event.datetime);
            const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 7) {
                categorizedEvents.weekly.push(event);
            } else if (diffDays <= 30) {
                categorizedEvents.monthly.push(event);
            } else {
                categorizedEvents.yearly.push(event);
            }
        });

        // Update counts and content
        Object.keys(categorizedEvents).forEach(category => {
            const count = categorizedEvents[category].length;
            document.querySelector(`#${category}-happenings .event-count`)
                .textContent = `${count} event${count !== 1 ? 's' : ''}`;
            
            this.renderHappeningsList(category, categorizedEvents[category]);
        });
    }

    renderHappeningsList(category, events) {
        const container = document.getElementById(`${category}-happenings`);
        if (events.length === 0) {
            container.innerHTML = '<div class="no-events">No upcoming events</div>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="happening-item" onclick="showEventDetails(${event.id})">
                <div class="happening-date">
                    ${new Date(event.datetime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <div class="happening-info">
                    <h4>${event.title}</h4>
                    <p>${event.venue}</p>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>
        `).join('');
    }

    toggleHappenings(category) {
        const list = document.getElementById(`${category}-happenings`);
        const header = list.previousElementSibling;
        const icon = header.querySelector('i');

        // Toggle active state
        const isActive = list.classList.toggle('active');
        icon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0)';
    }
}

// Initialize happenings
const happeningsManager = new HappeningsManager(); 