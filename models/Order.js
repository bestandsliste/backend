const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }, // Für eingeloggte Kunden
  customerName: { type: String, required: true }, // Kundenname (oder "Gast" bei Gästen)
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      }, // Produkt-Referenz
      quantity: { type: Number, required: true }, // Anzahl
    },
  ],
  totalPrice: { type: Number, required: true }, // Gesamtpreis
  uniqueLink: { type: String, required: true, unique: true }, // Link zur Bestellung
  shippingInfo: { type: String, default: 'Versandkosten exklusive' }, // Versandkostenhinweis
  createdAt: { type: Date, default: Date.now }, // Erstellungsdatum
});

module.exports = mongoose.model('Order', orderSchema);
