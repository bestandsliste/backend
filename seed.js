const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    title: 'Produkt 1',
    image: '/uploads/product1.jpg',
    availability: 'auf lager',
    price: 19.99,
  },
  {
    title: 'Produkt 2',
    image: '/uploads/product2.jpg',
    availability: 'ausverkauft',
    price: 29.99,
  },
  // Weitere Produkte
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB verbunden');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Seed-Daten eingefügt');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Fehler beim Verbinden mit MongoDB:', err.message);
  });
