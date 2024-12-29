const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
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

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Etwas ist schief gelaufen!' });
});

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
