const mongoose = require('mongoose');

const tipsSchema = mongoose.Schema(
  {
    spentAt: {
      type: String,
      require: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    tipAmount: {
      type: Number,
      required: true,
    },
    tipPercentage: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: true,
      foreignField: true,
    },
    date: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Tips = (module.exports = mongoose.model('Tips', tipsSchema));
module.exports = Tips;
