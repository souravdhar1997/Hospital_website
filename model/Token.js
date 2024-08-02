const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user',
    },
    token:{
        type:String,
        required:true
    },
    type: {
        type: String,
        required: true,
        enum: ['verification', 'passwordReset']
    },
    expiredAt:{
        type:Date,
        default:Date.now,
        index:{
            expires:86400000
        }
    }
})

const tokenModel = new mongoose.model("token",tokenSchema);
module.exports =tokenModel;
