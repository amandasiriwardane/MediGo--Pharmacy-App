const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  fullAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  role: {
    type: String,
    enum: ['customer', 'pharmacy', 'driver', 'admin'],
    default: 'customer'
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Customer specific fields
  customerDetails: {
    addresses: [addressSchema],
    prescriptions: [{
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },

  // Pharmacy specific fields
  pharmacyDetails: {
    pharmacyName: String,
    licenseNumber: String,
    description: String,
    address: {
      fullAddress: String,
      city: String,
      state: String,
      zipCode: String,
      latitude: Number,
      longitude: Number
    },
    operatingHours: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      openTime: String,
      closeTime: String,
      isClosed: { type: Boolean, default: false }
    }],
    documents: [{
      docType: String,
      fileUrl: String
    }],
    serviceRadius: {
      type: Number,
      default: 5 // km
    },
    rating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },

  // Driver specific fields
  driverDetails: {
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'scooter']
    },
    vehicleNumber: String,
    licenseNumber: String,
    licenseUrl: String,
    currentLocation: {
      latitude: Number,
      longitude: Number,
      lastUpdated: Date
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalDeliveries: {
      type: Number,
      default: 0
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);