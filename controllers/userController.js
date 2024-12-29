const { validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token Generierung
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Registrierung
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, customerPrice } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Benutzer existiert bereits' });
        }

        const user = await User.create({
            name,
            email,
            password,
            customerPrice,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            customerPrice: user.customerPrice,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler' });
    }
};

// Login
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                customerPrice: user.customerPrice,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Ungültige E-Mail oder Passwort' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler' });
    }
};

// Benutzerprofil
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            customerPrice: user.customerPrice,
        });
    } else {
        res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
};
