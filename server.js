const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // z.B., 'http://localhost:3000'
  })
);
app.use(express.json());

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('Backend läuft!');
});

// Produkt-Routen
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// MongoDB Verbindung
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB verbunden');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB-Verbindung fehlgeschlagen:', err.message);
  });
