const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: 'USER'
    },
    appointment: [{
        type: Schema.Types.ObjectId,
        ref: 'appointment'
    }],
    status: {
        type: Boolean,
        default: true
    },
    isVerified:{
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
)

const userModel = mongoose.model('user', UserSchema)
module.exports = userModel