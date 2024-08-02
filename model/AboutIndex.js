// models/About.js
const mongoose = require('mongoose');

const AboutIndexSchema = new mongoose.Schema({
    images: {
        type: [String]
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('AboutIndex', AboutIndexSchema);
