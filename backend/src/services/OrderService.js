import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ComplianceService } from './ComplianceService.js';
import { paymentService } from './payment/PaymentService.js';
import { ApiError } from '../utils/apiError.js';

export class OrderService {
  static async createOrder({ userId, orderItems, shippingAddress, dateOfBirth, paymentMethodToken }) {
    // 1. Compliance verification at checkout
    const complianceCheck = await ComplianceService.verifyAgeAndProvince(
      shippingAddress.province,
      dateOfBirth
    );

    if (!complianceCheck.allowed) {
      throw new ApiError(400, `Compliance Order Rejection: ${complianceCheck.reason}`);
    }

    // 2. Fetch products and calculate prices
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        throw new ApiError(404, `Product not found or inactive: ${item.name}`);
      }
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product ${product.name}. Available: ${product.stock}`);
      }

      itemsPrice += product.price * item.quantity;
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || ''
      });
    }

    // 3. Tax calculation based on buyer's province rule
    const taxPrice = Number((itemsPrice * complianceCheck.taxRate).toFixed(2));
    const shippingPrice = itemsPrice > 75 ? 0 : 9.99; // Free shipping over $75 CAD
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    // 4. Process payment via Payment Service Abstraction
    const paymentResult = await paymentService.processPayment({
      amount: totalPrice,
      currency: 'CAD',
      paymentMethodToken
    });

    // 5. Decrement inventory stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // 6. Create order record
    const orderNumber = `CP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderNumber,
      user: userId,
      orderItems: validatedItems,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      appliedTaxRate: complianceCheck.taxRate,
      appliedTaxName: complianceCheck.taxName,
      verifiedDob: dateOfBirth,
      ageVerifiedAtCheckout: true,
      paymentStatus: paymentResult.success ? 'paid' : 'failed',
      orderStatus: paymentResult.success ? 'processing' : 'pending',
      paymentResult: {
        id: paymentResult.transactionId,
        status: paymentResult.status,
        updateTime: new Date().toISOString()
      }
    });

    return order;
  }
}
