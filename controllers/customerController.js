const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Für Passwort-Hashing
const Customer = require('../models/Customer');

exports.loginCustomer = async (req, res) => {
  const { name, password } = req.body;
  console.log('Login-Request erhalten:', { name, password }); // Debugging

  try {
    // Kunden suchen
    const customer = await Customer.findOne({ name });
    console.log('Gefundener Kunde:', customer); // Debugging

    if (customer && (await bcrypt.compare(password, customer.password))) {
      // Token generieren
      const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(200).json({
        id: customer._id,
        name: customer.name,
        customerPrice: customer.customerPrice,
        token,
      });
    } else {
      console.log('Ungültige Anmeldedaten'); // Debugging
      res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }
  } catch (error) {
    console.error('Login-Fehler:', error.message); // Logge den genauen Fehler
    res.status(500).json({ message: 'Serverfehler' });
  }
};

exports.registerCustomer = async (req, res) => {
  const { name, password, customerPrice } = req.body;

  // Validierung der Eingabedaten
  if (!name || !password) {
    return res
      .status(400)
      .json({ message: 'Name und Passwort sind erforderlich' });
  }

  if (!customerPrice) {
    return res.status(400).json({ message: 'Kundenpreis ist erforderlich' });
  }

  try {
    // Überprüfen, ob der Kunde bereits existiert
    const existingCustomer = await Customer.findOne({ name });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Kunde existiert bereits' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Kunden erstellen
    const customer = await Customer.create({
      name,
      password: hashedPassword,
      customerPrice,
    });

    res.status(201).json({ message: 'Kunde erstellt', customer });
  } catch (error) {
    console.error('Fehler beim Registrieren:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
};
