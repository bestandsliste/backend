const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { search, availability } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (availability && availability !== 'Alle') {
            query.availability = availability;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Produkt nicht gefunden' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler' });
    }
};
