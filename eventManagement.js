class EventManagement {
    constructor() {
        this.events = LocalStorage.getEvents() || [];
        this.initializeEventManagement();
    }

    initializeEventManagement() {
        this.renderEventDashboard();
        this.bindEventHandlers();
        this.setupEventFilters();
    }

    renderEventDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'event-management-dashboard';
        dashboard.innerHTML = `
            <div class="event-controls">
                <div class="event-filters">
                    <select id="eventTypeFilter">
                        <option value="all">All Types</option>
                        <option value="music">Music</option>
                        <option value="sports">Sports</option>
                        <option value="arts">Arts</option>
                        <option value="food">Food</option>
                    </select>
                    <select id="eventStatusFilter">
                        <option value="all">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="past">Past</option>
                    </select>
                    <input type="date" id="eventDateFilter">
                </div>
                <button class="create-event-btn" onclick="eventManager.createNewEvent()">
                    <i class="fas fa-plus"></i> Create Event
                </button>
            </div>

            <div class="events-grid" id="eventsGrid">
                <!-- Events will be rendered here -->
            </div>

            <div class="event-stats">
                <div class="stat-card">
                    <h3>Total Events</h3>
                    <p class="stat-value">${this.events.length}</p>
                </div>
                <div class="stat-card">
                    <h3>Upcoming Events</h3>
                    <p class="stat-value">${this.getUpcomingEventsCount()}</p>
                </div>
                <div class="stat-card">
                    <h3>Total Attendees</h3>
                    <p class="stat-value">${this.getTotalAttendees()}</p>
                </div>
            </div>
        `;

        document.getElementById('eventManagementContainer').appendChild(dashboard);
    }

    createNewEvent() {
        // Show event creation form
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.innerHTML = `
            <div class="event-form">
                <h2>Create New Event</h2>
                <form id="newEventForm">
                    <div class="form-group">
                        <label>Event Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Event Type</label>
                        <select name="type" required>
                            <option value="music">Music</option>
                            <option value="sports">Sports</option>
                            <option value="arts">Arts</option>
                            <option value="food">Food</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date & Time</label>
                        <input type="datetime-local" name="datetime" required>
                    </div>
                    <div class="form-group">
                        <label>Venue</label>
                        <input type="text" name="venue" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Media</label>
                        <input type="file" multiple accept="image/*,video/*">
                    </div>
                    <div class="form-actions">
                        <button type="submit">Create Event</button>
                        <button type="button" onclick="this.closest('.event-modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.bindFormEvents(modal.querySelector('form'));
    }

    bindFormEvents(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const eventData = {
                id: Date.now(),
                title: formData.get('title'),
                type: formData.get('type'),
                datetime: formData.get('datetime'),
                venue: formData.get('venue'),
                description: formData.get('description'),
                createdBy: LocalStorage.getCurrentUser().id,
                createdAt: new Date().toISOString(),
                status: 'upcoming'
            };

            this.events.push(eventData);
            LocalStorage.saveEvents(this.events);
            this.renderEventDashboard();
            form.closest('.event-modal').remove();
        });
    }

    getUpcomingEventsCount() {
        const now = new Date();
        return this.events.filter(event => new Date(event.datetime) > now).length;
    }

    getTotalAttendees() {
        return this.events.reduce((total, event) => {
            return total + (event.attendees?.length || 0);
        }, 0);
    }

    setupEventFilters() {
        document.getElementById('eventTypeFilter').addEventListener('change', () => this.filterEvents());
        document.getElementById('eventStatusFilter').addEventListener('change', () => this.filterEvents());
        document.getElementById('eventDateFilter').addEventListener('change', () => this.filterEvents());
    }

    filterEvents() {
        const typeFilter = document.getElementById('eventTypeFilter').value;
        const statusFilter = document.getElementById('eventStatusFilter').value;
        const dateFilter = document.getElementById('eventDateFilter').value;

        const filteredEvents = this.events.filter(event => {
            const matchesType = typeFilter === 'all' || event.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || this.getEventStatus(event) === statusFilter;
            const matchesDate = !dateFilter || event.datetime.startsWith(dateFilter);
            return matchesType && matchesStatus && matchesDate;
        });

        this.renderFilteredEvents(filteredEvents);
    }
} 