const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true, default: 1 },
        }
    ],
    totalPrice: { type: Number, required: true },
    uniqueLink: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
