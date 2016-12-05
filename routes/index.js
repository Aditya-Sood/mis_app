var express = require('express');
var router = express.Router();
var logger = require('morgan');
var bodyParser = require('body-parser');
var auth = require('controllers/login');
var controllers = require('helper/controllerRegistery');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login_user);



/*
 * Routes that can be accessed only by authenticated & authorized users
*/
var BASE_PATH = '/api/v1/';

router.use('/api/v1/editDetails',controllers.editDetailsController);
router.use(BASE_PATH+'viewdetails',controllers.viewDetailsController);


module.exports = router;
