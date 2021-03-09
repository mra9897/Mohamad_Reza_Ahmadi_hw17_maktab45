const mongoose = require('mongoose');

module.exports = mongoose.model('Company', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    register_code: {
        type: String,
        required: true
    },
    register_date: Date,
    province: String,
    city: String,
    phone: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: Date
}));