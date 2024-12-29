const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

exports.createOrder = async (req, res) => {
  const { products, customerId } = req.body;

  try {
    let customer = null;
    let customerName = 'Gast';
    let totalPrice = 0;

    if (customerId) {
      const User = require('../models/User');
      customer = await User.findById(customerId);
      if (customer) {
        customerName = customer.name;
      }
    }

    // Berechne Gesamtpreis
    for (const item of products) {
      let price = item.product.price;
      if (customer) {
        price = customer.customerPrice;
      }
      totalPrice += price * item.quantity;
    }

    const { v4: uuidv4 } = require('uuid');

    // Verwende `uuidv4()` für das Generieren einer eindeutigen ID
    const uniqueLink = uuidv4();

    const order = await Order.create({
      customer: customer ? customer._id : null,
      customerName,
      products,
      totalPrice,
      uniqueLink,
    });

    res.status(201).json({
      message: 'Bestellung erstellt',
      uniqueLink: `${process.env.FRONTEND_URL}/order/${uniqueLink}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler' });
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
