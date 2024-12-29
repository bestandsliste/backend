const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    availability: { type: Number, enum: [0, 1], default: 1 }, // 0 = Ausverkauft, 1 = Auf Lager
    price: { type: Number, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
