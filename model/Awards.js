const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AwardsSchema = new Schema({
    
    image: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model("award", AwardsSchema);