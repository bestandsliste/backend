const mongoose = require('mongoose');

// Schema für die Kunden
const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    customerPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Erstellt automatisch `createdAt` und `updatedAt` Felder
  }
);

module.exports = mongoose.model('Customer', customerSchema);
