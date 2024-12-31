const Order = require('../models/Order');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid'); // Für die Generierung eines einmaligen Links

exports.createOrder = async (req, res) => {
  try {
    const { products, customerId, customerName } = req.body;

    // Validierung der Eingabedaten
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required.' });
    }

    // Verarbeite Produkte und berechne den Gesamtpreis
    let totalPrice = 0;
    const populatedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product); // Produkt abrufen
        if (!product) {
          throw new Error(`Product with ID ${item.product} not found.`);
        }
        totalPrice += product.price * item.quantity; // Preis * Menge
        return {
          product: product._id,
          quantity: item.quantity,
        };
      })
    );

    // Einmaligen Link generieren
    const uniqueLink = uuidv4();

    // Bestellung erstellen
    const order = new Order({
      products: populatedProducts,
      totalPrice,
      customerId: customerId || null,
      customerName: customerName || 'Gast', // Standard: "Gast"
      uniqueLink,
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully.',
      uniqueLink: `${process.env.FRONTEND_URL}/order/${uniqueLink}`,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'An error occurred while creating the order.',
      error: error.message,
    });
  }
};

// Bestelldetails basierend auf uniqueLink abrufen
exports.getOrderByLink = async (req, res) => {
  try {
    const { link } = req.params;
    const order = await Order.findOne({ uniqueLink: link }).populate(
      'products.product'
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      message: 'An error occurred while fetching the order.',
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product')
      .populate('customerId');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'An error occurred while fetching orders.',
      error: error.message,
    });
  }
};
