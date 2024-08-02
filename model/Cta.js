const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CtaSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
  
})

module.exports = mongoose.model("Cta", CtaSchema);