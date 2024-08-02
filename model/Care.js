const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CareSchema = new Schema({
    
    care: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    words: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("care", CareSchema);