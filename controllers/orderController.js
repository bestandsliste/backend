const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { products, customerId } = req.body;

    // Validierung der Eingabedaten
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required.' });
    }
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required.' });
    }

    // Konvertiere product IDs in ObjectIds
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

    // Berechne den Gesamtpreis
    const totalPrice = populatedProducts.reduce((sum, item) => {
      const product = item.product;
      return sum + product.price * item.quantity; // Produktpreis * Menge
    }, 0);

    // Bestellung erstellen
    const order = new Order({
      products: populatedProducts,
      totalPrice,
      customerId,
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
    res
      .status(500)
      .json({
        message: 'An error occurred while fetching orders.',
        error: error.message,
      });
  }
};
