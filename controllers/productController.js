const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { search, availability } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        if (availability !== undefined && availability !== '') {
            query.availability = Number(availability);
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler beim Abrufen der Produkte' });
    }
};
