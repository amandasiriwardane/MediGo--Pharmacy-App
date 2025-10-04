const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['prescription', 'otc', 'supplement', 'medical-equipment', 'personal-care']
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer name is required']
  },
  images: [{
    type: String
  }],
  
  pricing: {
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    discountPrice: {
      type: Number,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
      default: 0
    },
    unit: {
      type: String,
      enum: ['piece', 'bottle', 'box', 'strip'],
      default: 'piece'
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  },
  
  requiresPrescription: {
    type: Boolean,
    default: false
  },
  
  specifications: {
    expiryDate: Date,
    batchNumber: String,
    dosageForm: String, // tablets, syrup, capsule, etc.
    strength: String
  },
  
  tags: [String],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for checking if product is in low stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock.quantity <= this.stock.lowStockThreshold;
});

// Virtual for checking if product is out of stock
productSchema.virtual('isOutOfStock').get(function() {
  return this.stock.quantity === 0;
});

module.exports = mongoose.model('Product', productSchema);