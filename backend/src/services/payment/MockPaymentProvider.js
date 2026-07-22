export class MockPaymentProvider {
  async processPayment({ amount, currency = 'CAD', paymentMethodToken, customerEmail }) {
    // Simulating transaction processing with audit trace
    return {
      success: true,
      transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      status: 'paid',
      amount,
      currency,
      timestamp: new Date().toISOString()
    };
  }

  async refundPayment(transactionId, amount) {
    return {
      success: true,
      refundId: `REF_${Date.now()}`,
      status: 'refunded',
      amount
    };
  }
}
