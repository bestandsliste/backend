const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware zum Schutz von Routen
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Token aus den Headers extrahieren
            token = req.headers.authorization.split(' ')[1];

            // Token verifizieren
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Benutzer aus der Datenbank anhand der ID aus dem Token abrufen, ohne das Passwortfeld
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Nicht autorisiert, Token fehlgeschlagen' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Nicht autorisiert, kein Token vorhanden' });
    }
};

module.exports = { protect };