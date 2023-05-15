"use strict";
let express = require('express');
let router = express.Router();
const homeController = require('../controller/homeController')

/* GET home page. */
router.get('/', homeController.landing)

router.post('/', homeController.login)


/* GET Images from Nasa. */
router.get('/image/:start_date/:end_date',homeController.getImage)

router.get('/loadModel/:date', homeController.loadModel)


/* GET Comments for a picture from Data Base. */
router.get('/date/:id',homeController.getComments)


/* add a comment to the Data Base. */
router.post('/date',homeController.createComments)


/* delete a comment to the Data Base. */
router.delete('/del/:id',homeController.deleteComments)


/* get the Email */
router.get("/session",homeController.getEmail)

module.exports = router;