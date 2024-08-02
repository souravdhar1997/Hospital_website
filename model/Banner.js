const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    
    title: {
        type: String,
        required: true
    },
    sub_title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    }

})

module.exports = mongoose.model("banner", BannerSchema);