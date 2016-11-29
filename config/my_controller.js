/*
 * author : Rajat Bajaj
*/

/*
 * It is a user defined controller that shows the module
 * according to the user authorization
 * if user is student or empoloyee or admin
 * corrosponding modules are shown
*/

var Session = require('config/session');

const modules_table = 'modules';

function MyController(params = [],token) {
	//params is the array defining the auth_ids' that can access the module
	this.args = params;
	this.session = new Session(token);
}

MyController.prototype = {

	getMenu : function(callback){
		console.log(params);
		var user_id = session.getId();
		var auths = session.getAuth();

		getAllModules(function(err,result)
		{
			if(err)
			{
				callback(err,{'err_code':6});
			}
			else
			{
				//Go to all the modules and get the auths associated with them and show to user;
			}
		});
	},
}


function isModuleExist(module_name){
	
	/*getAllModules(function(err,result){
		if(err)
		{
			return false;
		}
		else
		{
			for(int i=0;i<result.length;i++)
			{
				if(result[i].id == module_name)
					return true;
			}

			return false;
		}
	});*/
}


function getAllModules(callback){
	var query = 'SELECT * FROM ' + modules_table + 'WHERE 1';
	db.query(query,params,function(err,result){
		if(err)
		{
			callback(err,{});
		}
		else
		{
			callback(err,result);
		}
	});
}

