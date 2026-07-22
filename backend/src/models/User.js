import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true, uppercase: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'Canada' },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['customer', 'admin', 'compliance_officer'],
      default: 'customer'
    },
    dateOfBirth: { type: Date, required: true },
    province: { type: String, required: true, uppercase: true },
    isAgeVerified: { type: Boolean, default: false },
    ageVerifiedAt: { type: Date },
    addresses: [addressSchema],
    refreshToken: { type: String, select: false },
    isVerified: { type: Boolean, default: true }, // Auto-verifying for seed demo flow
    verificationToken: String
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
