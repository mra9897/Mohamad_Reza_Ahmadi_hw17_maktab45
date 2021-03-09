const router = require('express').Router();

const Company = require('../models/Company');
const Employee = require('../models/Employee');

router.get('/', (req,res)=>{
    res.redirect(302, 'http://localhost:5002/company/all');
});
router.get('/fake-mokhaberat', (req,res)=>{
    Employee.find({companyId: "603d508b2770b7a423c6da6d"}, (err, employees)=>{
        if(err) return console.log(err);
        res.json(employees);
    });
});
router.get('/under-1-year', (req,res)=>{
    let queryString = "let yearAgo = new Date();\n" +
        "    yearAgo.setFullYear(yearAgo.getFullYear() - 1);\n" +
        "    Company.find({register_date: {$gt: yearAgo}}, (err, companies)=>{...})";
    let yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    console.log(yearAgo)
    Company.find({register_date: {$gt: yearAgo}}, (err, companies)=>{
        if(err) return console.log(err);
        res.json({
            query: queryString,
            companies
        });
    });
});
router.get('/admin-mokhaberat', (req,res)=>{
    Employee.find({companyId: "603d508b2770b7a423c6da6d", is_admin: true}, (err, employee)=>{
        if(err) return console.log(err);
        res.json(employee);
    });
});
router.get('/emp-20-30', (req,res)=>{
    Employee.aggregate([
        {
            $addFields: {
                thisYear: {$year: new Date()},
                birthYear: {$year: "$birth_date"}
            }
        }, {
            $project: {
                _id: 0,
                is_admin: 1,
                first_name: 1,
                last_name: 1,
                national_code: 1,
                gender: 1,
                birth_date: 1,
                age: {
                    $subtract: ["$thisYear", "$birthYear"]
                }
            }
        },
        {
            $match: {
                age: {$gte: 20, $lte: 30}
            }
        }
    ], (err, employees)=>{
        if(err) return console.log(err);
        res.json(employees)
    })
})
router.get('/admins', (req,res)=>{
    Employee.find({is_admin: true}, (err, employees)=>{
        if(err) return console.log(err);
        res.json(employees);
    });
});
router.get('/update-company-city', (req,res)=>{
    Company.updateMany({}, {province: "Tehran", city: "Tehran"}, (err, update)=>{
        if(err) return console.log(err);
        res.json(update);
    });
});
router.get('/manager-company', ((req, res) => {
    Employee.find({is_admin: true}, {first_name: 1, last_name: 1}).populate('companyId', {name: 1, _id: 0}).lean().exec((err, result)=>{
        for (let emp of result){
            emp.name = `${emp.first_name} ${emp.last_name} - ${emp.companyId.name}`;
            delete emp.first_name;
            delete emp.last_name;
            delete emp.companyId;
        }
        res.json(result);
    });
}))
module.exports = router;