class LocalStorage {
    static saveEvents(events) {
        localStorage.setItem('events', JSON.stringify(events));
    }

    static getEvents() {
        return JSON.parse(localStorage.getItem('events')) || [];
    }

    static saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    static getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    static setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    static clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    static addEvent(event) {
        const events = this.getEvents();
        events.push(event);
        this.saveEvents(events);
    }

    static updateEvent(eventId, updatedEvent) {
        const events = this.getEvents();
        const index = events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            events[index] = updatedEvent;
            this.saveEvents(events);
        }
    }

    static deleteEvent(eventId) {
        const events = this.getEvents();
        const filteredEvents = events.filter(e => e.id !== eventId);
        this.saveEvents(filteredEvents);
    }
} 