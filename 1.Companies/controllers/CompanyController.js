const _error = require('./Controller');
const objectID = require('mongoose').Types.ObjectId;

const Company = require('../models/Company');
const Employee = require('../models/Employee');

const create = (req, res) => {
    const data = req.body;
    if (!data) return _error("parameters not set");

    const validate = _validate(data);
    if (validate.length > 0) return _error(validate.join('\n'));

    const newCompany = new Company(data);

    return newCompany.save((err, company) => {
        if (err) res.json(_error(err.message));
        res.json({result: 1});
    });
}
const all = (req, res) => {
    const data = req.query;
    let condition = {}
    if (data.startDate && data.endDate)
        condition = {register_date: {$gte: data.startDate, $lte: data.endDate}};
    return Company.find(condition, (err, companies) => {
        if (err) res.json(_error(err.message));
        if (typeof req.params.type === "undefined" || req.params.type === "view")
            res.render('index', {page: "main", data: companies});
        else
            res.json(companies);
    });
}
const single = (req, res) => {
    const id = req.params.id;
    // if (!id) return res.json(_error("id not set"));
    if (!id) return res.render('index', {page: 'single'});
    return Company.find({_id: id}).populate('companyId').exec((err, company) => {
        if (err) return res.json(_error(err.message));
        if(!company.length) return res.status(404).json(_error("not found"));
        Employee.find({companyId: new objectID(company[0]._id)}, (err, employees) => {
            if (err) res.json(_error(err.message));
            let hasAdmin = employees.find(emp => emp.is_admin === true);
            if (typeof hasAdmin !== "object")
                hasAdmin = {};
            company[0].has_admin = hasAdmin;
            const responseData = {company: company[0], employees}
            if (typeof req.params.type === "undefined" || req.params.type === "view")
                res.render('index', {page: "single", data: responseData});
            else
                res.json(responseData);
        });
    });
}
const update = (req, res) => {
    const data = req.body;
    const id = req.params.id;
    if (!data) return  res.json(_error("parameters not set"));
    if (!id) return  res.json(_error("id not set"));

    return Company.updateOne({_id: id}, data, (err, company) => {
        if (err) return res.json(_error(err.message));
        res.json({result: company.ok, updated: company.n});
    });
}
const remove = (req, res) => {
    const id = req.params.id;
    if (!id) res.json(_error("id not set"));
    return Company.deleteOne({_id: id}, (err, company) => {
        if (err) res.json(_error(err.message));
        res.json({result: company.ok});
    });
}
const _validate = data => {
    const errors = [];
    if (!data.name) errors.push("company name is require");
    if (!data.register_code) errors.push("register code is required");
    if (!data.register_date) errors.push("register date is required");
    return errors;
}

module.exports = {all, single, create, update, remove};