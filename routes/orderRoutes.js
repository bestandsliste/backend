const express = require('express');
const { createOrder, getOrders } = require('../controllers/orderController');
const router = express.Router();

router.post('/', createOrder); // Route für Bestellungserstellung
router.get('/', getOrders); // Route für Abrufen von Bestellungen

module.exports = router;
