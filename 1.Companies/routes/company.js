const router = require('express').Router();

const Company = require('../controllers/CompanyController');

router.post('/create', Company.create);
router.get('/all/:type?', Company.all);
router.get('/single/:id?/:type?', Company.single);
router.put('/update/:id', Company.update);
router.delete('/delete/:id', Company.remove);

module.exports = router;