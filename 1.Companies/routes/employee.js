const router = require('express').Router();

const Employee = require('../controllers/EmployeeController');

router.post('/create', Employee.create);
router.get('/all', Employee.all);
router.get('/single/:id', Employee.single);
router.put('/update/:id', Employee.update);
router.delete('/delete/:id', Employee.remove);

module.exports = router;