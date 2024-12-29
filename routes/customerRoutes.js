const express = require('express');
const { loginCustomer, registerCustomer } = require('../controllers/customerController');
const { body } = require('express-validator');

const router = express.Router();

// Kundenregistrierung
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name ist erforderlich'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Passwort muss mindestens 6 Zeichen lang sein'),
    body('customerPrice')
      .isNumeric()
      .withMessage('Kundenpreis muss eine Zahl sein'),
  ],
  registerCustomer
);

// Kunden-Login
router.post(
  '/login',
  [
    body('name').notEmpty().withMessage('Name ist erforderlich'),
    body('password').notEmpty().withMessage('Passwort ist erforderlich'),
  ],
  loginCustomer
);

module.exports = router;
