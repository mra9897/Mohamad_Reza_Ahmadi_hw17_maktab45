const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Employee = require('./Employee');

const CompanySchema = new Schema({
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
});

CompanySchema.pre('deleteOne', function (next){
    Employee.deleteMany({companyId: this._conditions._id}, err=>{
        if(err) return next(err);
        return next();
    });
});

module.exports = mongoose.model('Company', CompanySchema);