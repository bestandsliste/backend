const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Order', orderSchema);
