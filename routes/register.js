"use strict";
let express = require('express');
let router = express.Router();
const registerController = require('../controller/registerController')

/* display register page */
router.get('/', registerController.landing)

router.post('/', registerController.backFromPassword)

module.exports = router;
