let express = require('express');
let router = express.Router();
const userController = require('../Controller/loginController')

/* GET home page. */
router.get('/', userController.landing);

router.get('/login', userController.landing);

router.post('/', userController.landing);

/* For logOut. */
router.get('/logout', userController.logOut);

/* after complete registration with email and password */
router.post('/completed', userController.finishRegister)


module.exports = router;