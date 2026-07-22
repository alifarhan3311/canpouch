import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String }
});

const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true, uppercase: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'Canada' }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    appliedTaxRate: { type: Number, required: true },
    appliedTaxName: { type: String, required: true },
    ageVerifiedAtCheckout: { type: Boolean, required: true, default: true },
    verifiedDob: { type: Date, required: true },
    paymentMethod: { type: String, required: true, default: 'CreditCard' },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'age_verified', 'processing', 'shipped', 'delivered', 'cancelled', 'restricted_blocked'],
      default: 'pending'
    },
    trackingNumber: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
