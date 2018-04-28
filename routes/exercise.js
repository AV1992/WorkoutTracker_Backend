var express = require('express');
var router = express.Router();

var exercisecontroller = require('../controllers/exerciseController');

/* GET users listing. */
router.get('/', exercisecontroller.getAll);
router.get('/:id', exercisecontroller.getById);
router.get('/getForUser/:userid', exercisecontroller.getForUser);

router.post('/', exercisecontroller.create);

router.put('/', exercisecontroller.update);

router.delete('/:id', exercisecontroller.delete);

module.exports = router;