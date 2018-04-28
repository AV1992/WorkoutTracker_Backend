var express = require('express');
var router = express.Router();

var userontroller = require('../controllers/userController');

router.post('/', userontroller.create);
router.get('/getByUsernamePassword/:username/:password', userontroller.getByUsernamePassword);

module.exports = router;