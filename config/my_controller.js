/*
 * author : Rajat Bajaj
*/
var Session = require(config/session);


function MyController(params = [],token) {
	//params is the array defining the auth_ids' that can access the module
	this.args = params;
	this.params = new Session(token);
}

MyController.prototype = {

	getMenu() : function(){
		console.log(params);
	},
}