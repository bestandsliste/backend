const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer'); // Das Customer-Modell

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token extrahieren
      token = req.headers.authorization.split(' ')[1];

      // Token verifizieren
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kunde aus der Datenbank holen
      req.customer = await Customer.findById(decoded.id).select('-password'); // Passwort weglassen
      next();
    } catch (error) {
      console.error('Nicht autorisiert, Token ungültig');
      res.status(401).json({ message: 'Nicht autorisiert' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Kein Token, Zugriff verweigert' });
  }
};

module.exports = { protect };
