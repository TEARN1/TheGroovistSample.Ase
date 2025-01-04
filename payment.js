class PaymentSystem {
    constructor() {
        this.stripe = Stripe('your_publishable_key');
        this.initializePayment();
    }

    async processPayment(ticketDetails) {
        try {
            const paymentIntent = await this.createPaymentIntent(ticketDetails);
            const result = await this.stripe.confirmCardPayment(paymentIntent.clientSecret, {
                payment_method: {
                    card: elements.getElement('card'),
                    billing_details: {
                        name: ticketDetails.customerName,
                        email: ticketDetails.customerEmail
                    }
                }
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            return this.handlePaymentSuccess(result.paymentIntent, ticketDetails);
        } catch (error) {
            this.handlePaymentError(error);
        }
    }

    async createPaymentIntent(ticketDetails) {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketDetails)
        });
        return response.json();
    }
} 