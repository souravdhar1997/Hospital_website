const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({

    department: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    timings: {
        mondayToFriday: String,
        saturday: String,
        sunday: String,
        contactNumber: String
    },
    services: {
        features: [String]
    },

})

module.exports = mongoose.model("department", DepartmentSchema);