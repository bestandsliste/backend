const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    availability: {
      type: String,
      enum: ['auf lager', 'ausverkauft'],
      default: 'auf lager',
    },
    price: { type: Number, required: true },
    // Weitere Felder nach Bedarf
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
