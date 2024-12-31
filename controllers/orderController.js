const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

exports.createOrder = async (req, res) => {
  const { products, customerId } = req.body;

  try {
    console.log('Eingehende Bestellung:', { products, customerId }); // Log eingehender Daten

    let customer = null;
    let customerName = 'Gast';
    let totalPrice = 0;

    if (customerId) {
      const User = require('../models/User');
      customer = await User.findById(customerId);
      console.log('Gefundener Kunde:', customer); // Log Kundendaten
      if (customer) {
        customerName = customer.name;
      }
    }

    // Berechne Gesamtpreis
    for (const item of products) {
      console.log('Produkt:', item); // Log jedes Produkt
      let price = item.product.price;
      if (customer) {
        price = customer.customerPrice;
      }
      totalPrice += price * item.quantity;
    }

    console.log('Gesamtpreis:', totalPrice); // Log den Gesamtpreis

    const uniqueLink = uuidv4();

    // Erstelle Bestellung
    const order = await Order.create({
      customer: customer ? customer._id : null,
      customerName,
      products,
      totalPrice,
      uniqueLink,
    });

    console.log('Erstellte Bestellung:', order); // Log die erstellte Bestellung

    res.status(201).json({
      message: 'Bestellung erstellt',
      uniqueLink: `${process.env.FRONTEND_URL}/order/${uniqueLink}`,
    });
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error); // Log Fehler
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product')
      .populate('customer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler' });
  }
};
