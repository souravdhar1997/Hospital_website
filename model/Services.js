const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServicesSchema = new Schema({

    service: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
  

})

module.exports = mongoose.model("service", ServicesSchema);