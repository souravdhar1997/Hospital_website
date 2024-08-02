const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    postCount: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('category', CategorySchema);
