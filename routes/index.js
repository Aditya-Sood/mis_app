var express = require('express');
var router = express.Router();
var auth = require('controllers/login');
var controller = require('config/my_controller');

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

	if(!controller.isExistModule(module_name) || function_name.length == 0)
	{
		res.status(500);
        res.json({
          "status": 500,
          "message": "Oops something went wrong",
          "error": err
        });
        return;
	}

	var module = require('controllers/'+module_name);
	//calling the function for the corrosponding module
	module[function_name](req,res);
});



module.exports = router;
