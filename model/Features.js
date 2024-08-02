const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featureSchema = new Schema({
    service: {
        type: String,
        required: true
    },
    appointment_type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hours: {
        type: Map,
        of: String,
        required: true
    },
    emergency: {
        type: String,
        required: true
    },
    em_note: {
        type: String,
        required: true
    }
});

const Feature = mongoose.model('Feature', featureSchema);

module.exports = Feature;