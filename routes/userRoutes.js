const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

// Benutzerregistrierung
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name ist erforderlich'),
    body('email').isEmail().withMessage('Ungültige E-Mail'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Passwort muss mindestens 6 Zeichen lang sein'),
  ],
  registerUser
);

// Benutzer-Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Ungültige E-Mail'),
    body('password').notEmpty().withMessage('Passwort ist erforderlich'),
  ],
  loginUser
);

// Benutzerprofil (nur für eingeloggte Benutzer)
router.get('/profile', protect, getUserProfile);

module.exports = router;
