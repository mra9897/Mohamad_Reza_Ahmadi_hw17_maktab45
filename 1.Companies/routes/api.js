const router = require('express').Router();

const company = require('./company');
const employee = require('./employee');
const query = require('./query');

router.use('/company', company);
router.use('/employee', employee);
router.use('/', query);

module.exports = router;