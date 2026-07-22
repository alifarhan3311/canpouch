import { MockPaymentProvider } from './MockPaymentProvider.js';

class PaymentService {
  constructor() {
    const providerName = process.env.PAYMENT_PROVIDER || 'MOCK';
    
    // Abstract Factory pattern supporting plug-and-play Moneris/Stripe/Authorize.net
    switch (providerName.toUpperCase()) {
      case 'MOCK':
      default:
        this.provider = new MockPaymentProvider();
        break;
    }
  }

  async processPayment(paymentDetails) {
    return await this.provider.processPayment(paymentDetails);
  }

  async refundPayment(transactionId, amount) {
    return await this.provider.refundPayment(transactionId, amount);
  }
}

export const paymentService = new PaymentService();
