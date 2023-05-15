"use strict";
let express = require('express');
let router = express.Router();
const passwordController = require('../Controller/passWordController')

/**
 * go directly to password view
 */
router.get('/', passwordController.landing)

router.post('/', passwordController.createPassword)

module.exports = router;
