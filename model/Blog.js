const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model("blog", BlogSchema);