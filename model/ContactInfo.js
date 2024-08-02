const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactInfoSchema = new Schema({

    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    }
})

module.exports = mongoose.model("contactinfo", ContactInfoSchema);