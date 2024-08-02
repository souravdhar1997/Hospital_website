const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({

    fullName: {
        type: String
    },
    email: {
        type: String
    },
    topic: {
        type: String
    },
    phone: {
        type: Number
    },
    message: {
        type: String
    }
  
})

module.exports = mongoose.model("contact", ContactSchema);