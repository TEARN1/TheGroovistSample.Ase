class EventCalendar {
    constructor() {
        this.events = LocalStorage.getEvents();
        this.initializeCalendar();
    }

    initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: this.formatEventsForCalendar(),
            eventClick: this.handleEventClick.bind(this),
            eventDidMount: this.handleEventMount.bind(this),
            eventContent: this.renderEventContent.bind(this)
        });

        this.calendar.render();
        this.bindCalendarEvents();
    }

    formatEventsForCalendar() {
        return this.events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.datetime,
            end: event.endDateTime,
            extendedProps: {
                venue: event.venue,
                type: event.eventType,
                tickets: event.tickets
            }
        }));
    }

    handleEventClick(info) {
        this.showEventDetails(info.event);
    }
} 