const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Definiere erlaubte Ursprünge
const allowedOrigins = [
  'http://localhost:3000', // Lokales Frontend während der Entwicklung
  'https://bestandsliste.vercel.app', // Produktions-Frontend
];

// CORS-Konfiguration
app.use(
  cors({
    origin: function (origin, callback) {
      // Erlaube Anfragen ohne Origin (z.B. mobile Apps oder CURL)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'Die CORS-Richtlinie für diese Seite erlaubt keinen Zugriff von der angegebenen Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Middleware
app.use(express.json());

// Middleware zum Servieren von statischen Dateien
app.use('/uploads', express.static('uploads'));

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('Backend läuft!');
});

// Produkt-Routen
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Benutzer-Routen
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Bestell-Routen
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Fehlerbehandlung Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Etwas ist schief gelaufen!' });
});

// MongoDB Verbindung
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB verbunden');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB-Verbindung fehlgeschlagen:', err.message);
  });
