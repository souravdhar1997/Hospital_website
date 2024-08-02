const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  logo: String,
  description: String,
  departments: [String],
  support: [String],
  contact: {
    email: String,
    phone: String,
    availability: String,
  },
});

const Footer = mongoose.model('footer', footerSchema);

module.exports = Footer;
