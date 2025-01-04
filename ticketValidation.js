class TicketValidation {
    constructor() {
        this.scanner = null;
        this.validationHistory = LocalStorage.getValidationHistory() || [];
    }

    // Initialize QR Scanner
    initializeScanner(containerId) {
        this.scanner = new Html5QrcodeScanner(containerId, {
            fps: 10,
            qrbox: 250,
            aspectRatio: 1.0
        });
    }

    // Start scanning for ticket validation
    startScanning() {
        this.scanner.render((decodedText) => {
            this.validateTicket(decodedText);
        }, (error) => {
            console.warn(`QR Code scanning failed: ${error}`);
        });
    }

    // Validate ticket
    async validateTicket(ticketCode) {
        try {
            // First, check if ticket has been used before
            if (this.isTicketUsed(ticketCode)) {
                throw new Error('Ticket has already been used');
            }

            const ticket = await this.findTicket(ticketCode);
            
            if (!ticket) {
                throw new Error('Invalid ticket');
            }

            // Check if ticket is for today's event
            if (!this.isTicketForToday(ticket)) {
                throw new Error('Ticket is not valid for today');
            }

            // Validate ticket and record usage
            this.recordTicketUsage(ticket);
            
            // Show success message
            this.showValidationResult({
                success: true,
                message: 'Ticket validated successfully',
                ticket: ticket
            });

        } catch (error) {
            this.showValidationResult({
                success: false,
                message: error.message
            });
        }
    }

    // Check if ticket has been used
    isTicketUsed(ticketCode) {
        return this.validationHistory.some(
            validation => validation.ticketCode === ticketCode
        );
    }

    // Find ticket in database
    findTicket(ticketCode) {
        const tickets = LocalStorage.getTickets();
        return tickets.find(ticket => 
            ticket.ticketCodes.includes(ticketCode)
        );
    }

    // Check if ticket is for today's event
    isTicketForToday(ticket) {
        const event = LocalStorage.getEvents().find(e => e.id === ticket.eventId);
        const eventDate = new Date(event.datetime);
        const today = new Date();

        return eventDate.toDateString() === today.toDateString();
    }

    // Record ticket usage
    recordTicketUsage(ticket) {
        const validation = {
            ticketCode: ticket.ticketCodes[0],
            ticketId: ticket.id,
            eventId: ticket.eventId,
            validatedAt: new Date().toISOString(),
            validatedBy: LocalStorage.getCurrentUser().id,
            location: this.getCurrentLocation()
        };

        this.validationHistory.push(validation);
        LocalStorage.saveValidationHistory(this.validationHistory);

        // Update ticket status
        ticket.status = 'used';
        LocalStorage.updateTicket(ticket);
    }

    // Get current location
    getCurrentLocation() {
        return {
            latitude: 0, // Would be actual GPS coordinates
            longitude: 0,
            venue: 'Main Entrance' // Would be actual venue location
        };
    }

    // Show validation result
    showValidationResult(result) {
        const validationUI = document.createElement('div');
        validationUI.className = `validation-result ${result.success ? 'success' : 'error'}`;
        
        validationUI.innerHTML = `
            <div class="validation-popup">
                <div class="validation-header">
                    <i class="fas fa-${result.success ? 'check-circle' : 'times-circle'}"></i>
                    <h3>${result.success ? 'Valid Ticket' : 'Invalid Ticket'}</h3>
                </div>
                
                ${result.success ? this.getSuccessHTML(result.ticket) : this.getErrorHTML(result.message)}
                
                <button onclick="this.parentElement.remove()">Close</button>
            </div>
        `;

        document.body.appendChild(validationUI);
    }

    // Generate success HTML
    getSuccessHTML(ticket) {
        const event = LocalStorage.getEvents().find(e => e.id === ticket.eventId);
        return `
            <div class="ticket-details">
                <p><strong>Event:</strong> ${event.title}</p>
                <p><strong>Ticket Type:</strong> ${ticket.ticketType}</p>
                <p><strong>Validated at:</strong> ${new Date().toLocaleTimeString()}</p>
                <p><strong>Entry Point:</strong> Main Entrance</p>
            </div>
        `;
    }

    // Generate error HTML
    getErrorHTML(message) {
        return `
            <div class="error-message">
                <p>${message}</p>
                <p>Please try again or contact support.</p>
            </div>
        `;
    }
}

// Styles for the validation UI
const styles = `
    .validation-result {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        max-width: 400px;
        width: 90%;
    }

    .validation-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .validation-header i {
        font-size: 24px;
    }

    .success .validation-header i {
        color: #4CAF50;
    }

    .error .validation-header i {
        color: #f44336;
    }

    .ticket-details {
        margin: 15px 0;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .error-message {
        color: #f44336;
        text-align: center;
        margin: 15px 0;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 