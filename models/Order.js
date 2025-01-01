const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Referenz zu Produkten
      quantity: { type: Number, required: true }, // Menge
    },
  ],
  totalPrice: { type: Number, required: true }, // Gesamtpreis
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null }, // Optionaler Kunde
  customerName: { type: String, default: 'Gast' }, // Name des Kunden
  uniqueLink: { type: String, required: true, unique: true }, // Eindeutiger Link
  createdAt: { type: Date, default: Date.now }, // Erstellungsdatum
});

module.exports = model('Order', orderSchema);
