const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { products, customerId } = req.body;

    // Validierung der Produkte
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required.' });
    }

    // Optional: Kundeninformationen laden, wenn eine ID übergeben wurde
    let customer = null;
    let customerName = 'Gast';
    if (customerId) {
      customer = await Customer.findById(customerId); // Stelle sicher, dass `Customer` importiert ist
      if (customer) {
        customerName = customer.name;
      }
    }

    // Produkte validieren und Gesamtpreis berechnen
    const populatedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product with ID ${item.product} not found.`);
        }
        return {
          product: product._id,
          quantity: item.quantity,
        };
      })
    );

    const totalPrice = populatedProducts.reduce((sum, item) => {
      const product = item.product;
      return sum + product.price * item.quantity; // Preis * Menge
    }, 0);

    // Bestellung erstellen
    const order = new Order({
      products: populatedProducts,
      totalPrice,
      customerId: customer ? customer._id : null, // Null für Gastbestellungen
      customerName, // Speichere Kundenname oder "Gast"
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully.', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res
      .status(500)
      .json({
        message: 'An error occurred while creating the order.',
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
