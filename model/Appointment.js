const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "department"
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "doctor"
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("appointment", AppointmentSchema);