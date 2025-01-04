class ErrorHandler {
    constructor() {
        this.errorTypes = {
            payment: PaymentErrorHandler,
            validation: ValidationErrorHandler,
            system: SystemErrorHandler
        };
    }

    async handleError(error) {
        // Log and handle errors appropriately
        await this.logError(error);
        await this.notifyRelevantTeams(error);
        return this.getUserFriendlyMessage(error);
    }
} 