var express = require('express');
var router = express.Router();
var logger = require('morgan');
var bodyParser = require('body-parser');
var auth = require('controllers/login');
//var controller = require('config/my_controller');
var controllers = require('helper/controllerRegistery');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());


/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login_user);



/*
 * Routes that can be accessed only by authenticated & authorized users
*/
var prefix = '/api/v1';
console.log(controllers);

router.use(prefix+'/editDetails',controllers.editDetailsController);
/*router.get(prefix+'/editDetails',function(req,res){
	console.log(req);
	res.json({'hey':'hey'});
});*/


module.exports = router;
