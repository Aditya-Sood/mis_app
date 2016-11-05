var express = require('express');
var router = express.Router();
var auth = require('controllers/login');

/*
 * Routes that can be accessed by any one
 */


router.post('/login', auth.login_user);



/*
 * Routes that can be accessed only by authenticated & authorized users
*/
router.get('/api/v1/*/*',function(req,res){

	//getting value for first *
	var module_name = req.params['0'];
	//getting value for second *
	var function_name = req.params['1'];

	var module = require('controllers/'+module_name);
	//calling the function for the corrosponding module
	module[function_name](req,res);
});



module.exports = router;
