class EventManager {
    constructor() {
        this.events = JSON.parse(localStorage.getItem('events')) || [];
    }

    // Create new event
    createEvent(eventData) {
        const newEvent = {
            id: Date.now(),
            ...eventData,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString()
        };

        this.events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(this.events));
        return newEvent;
    }

    // Get events by time period
    getEventsByPeriod(period) {
        const now = new Date();
        const events = this.events.filter(event => {
            const eventDate = new Date(event.datetime);
            const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

            switch(period) {
                case 'weekly':
                    return diffDays <= 7;
                case 'monthly':
                    return diffDays > 7 && diffDays <= 30;
                case 'yearly':
                    return diffDays > 30;
                default:
                    return true;
            }
        });

        return events.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    }

    // Like/Unlike event
    toggleLike(eventId, userId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return false;

        const likeIndex = event.likes.indexOf(userId);
        if (likeIndex === -1) {
            event.likes.push(userId);
        } else {
            event.likes.splice(likeIndex, 1);
        }

        localStorage.setItem('events', JSON.stringify(this.events));
        return true;
    }

    // Add comment
    addComment(eventId, userId, comment) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return false;

        event.comments.push({
            id: Date.now(),
            userId,
            text: comment,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem('events', JSON.stringify(this.events));
        return true;
    }
}

// Initialize event manager
const eventManager = new EventManager(); 