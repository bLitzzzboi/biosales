const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const policySchema = new Schema({
  policy_name: {
    type: String,
    required: true
  },
  multiplier: {
    type: Number,
    required: true
  }
});

const packSizeSchema = new Schema({
  pack_size: {
    type: String,
    required: true
  },
  price_per_pack: {
    type: Number,
    required: true
  }
});

const productSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  policies: [policySchema],

  pack_sizes: [packSizeSchema]

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
