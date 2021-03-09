const mongoose = require('mongoose');

module.exports = mongoose.model('Employee', new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    national_code: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male","female"]
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    birth_date: Date,
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: Date
}));