class TicketingSystem {
    constructor() {
        this.tickets = LocalStorage.getTickets() || [];
        this.initializeTicketing();
    }

    initializeTicketing() {
        this.bindTicketEvents();
        this.updateTicketAvailability();
    }

    purchaseTickets(eventId, ticketType, quantity) {
        const event = LocalStorage.getEvents().find(e => e.id === eventId);
        if (!event) return false;

        const tier = event.tickets.tiers[ticketType];
        if (!tier || tier.available < quantity) {
            throw new Error('Insufficient tickets available');
        }

        const ticketPurchase = {
            id: Date.now(),
            eventId,
            userId: LocalStorage.getCurrentUser().id,
            ticketType,
            quantity,
            totalPrice: tier.price * quantity,
            purchaseDate: new Date().toISOString(),
            ticketCodes: this.generateTicketCodes(quantity),
            status: 'active'
        };

        // Update availability
        tier.available -= quantity;
        LocalStorage.updateEvent(eventId, event);

        // Save purchase
        this.tickets.push(ticketPurchase);
        LocalStorage.saveTickets(this.tickets);

        return ticketPurchase;
    }

    generateTicketCodes(quantity) {
        return Array(quantity).fill().map(() => 
            Math.random().toString(36).substring(2, 15).toUpperCase()
        );
    }

    renderTicket(ticket) {
        return `
            <div class="ticket">
                <div class="ticket-header">
                    <h3>${ticket.eventTitle}</h3>
                    <span class="ticket-type">${ticket.ticketType}</span>
                </div>
                
                <div class="ticket-details">
                    <div class="qr-code" id="qr-${ticket.id}"></div>
                    <div class="ticket-info">
                        <p>Ticket Code: ${ticket.ticketCodes[0]}</p>
                        <p>Purchase Date: ${new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                        <p>Status: ${ticket.status}</p>
                    </div>
                </div>
            </div>
        `;
    }
} 