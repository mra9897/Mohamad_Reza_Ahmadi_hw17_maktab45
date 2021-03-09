require('./Controller');
const Employee = require('../models/Employee');

const create = (req, res) => {
    const validate = _validate(req.body);
    if(validate.length > 0) return _error(validate.join('\n'));

    const data = req.body;

    const newEmployee = new Employee(data);

    return newEmployee.save((err, employee)=>{
        if(err) res.json(_error(err.message));
        res.json({ok: 1});
    });
}
const all = (req, res) => {
    return Employee.find({}, (err, companies)=>{
        if(err) res.json(_error(err.message));
        res.json(companies);
    });
}
const single = (req, res) => {
    const id = req.params.id;
    if(!id) res.json(_error("id not set"));

    return Employee.find({_id: id}, (err, company)=>{
        if(err) res.json(_error(err.message));
        res.json( company);
    });
}
const update = (req, res) => {
    const data = req.body;
    const id = req.params.id;
    if(!data) res.json(_error("parameters not set"));
    if(!id) res.json(_error("id not set"));

    return Employee.updateOne({_id: id}, data,  (err, company)=>{
        if(err) res.json(_error(err.message));
        res.json(company);
    });
}
const remove = (req, res) => {
    const id = req.params.id;
    if(!id) res.json(_error("id not set"));
    return Employee.deleteOne({_id: id}, (err, company)=>{
        if(err) res.json(_error(err.message));
        res.json(company);
    });
}
const _validate = data => {
    const errors = [];
    if(!data.first_name) errors.push("first name is require");
    if(!data.last_name) errors.push("last name is required");
    if(!data.national_code) errors.push("national code is required");

    return errors;
}

module.exports = {all, single, create, update, remove};