const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

// Registrierungsroute
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name ist erforderlich'),
        body('email').isEmail().withMessage('Ungültige E-Mail'),
        body('password').isLength({ min: 6 }).withMessage('Passwort muss mindestens 6 Zeichen lang sein'),
        body('customerPrice').isNumeric().withMessage('Kundenpreis muss eine Zahl sein'),
    ],
    registerUser
);

// Login-Route
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Ungültige E-Mail'),
        body('password').notEmpty().withMessage('Passwort ist erforderlich'),
    ],
    loginUser
);

// Profil-Route (geschützt)
router.get('/profile', protect, getUserProfile);

module.exports = router;
