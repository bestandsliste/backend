const express = require('express');
const {
  createOrder,
  getOrderByLink,
} = require('../controllers/orderController');
const router = express.Router();

router.post('/', createOrder); // Bestellung erstellen
router.get('/:link', getOrderByLink); // Bestellung mit uniqueLink abrufen

module.exports = router;
