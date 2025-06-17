import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },

  password: { type: String }, // Required only for local login

  provider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local',
  },

  providerId: { type: String }, // For Google/Facebook UID

  profilePic: String,

  role: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user',
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  accessLevel: {
    type: String,
    enum: ['all', 'limited', 'time-limited'],
    default: 'limited',
  },

  accessExpiresAt: {
    type: Date,
    default: null,
  },

  loginHistory: [
    {
      date: { type: Date, default: Date.now },
      ip: String,
      device: String,
      location: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison method
userSchema.methods.comparePassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
