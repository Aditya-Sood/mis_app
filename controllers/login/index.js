var jwt = require('jwt-simple');
var userModel = require('models/user');


var auth = {
	login_user: function(req,res){
		var username = req.query.username || '';
		var password = req.query.password || '';
		if (username == '' || password == '') {
			res.status(401);
			res.json({
				"status": 401,
				"err_code": 2
			});
			return;
		}

		// Fire a query to your DB and check if the credentials are valid
		var dbUserObj = auth.validate(username, password,function(err,dbUserObj){
			if (!dbUserObj) { // If authentication fails, we send a 401 back
				res.status(401);
				res.json({
				"status": 401,
				"err_code": 2
				});
				return;
			}

			
			if (dbUserObj) {
				// If authentication is success, we will generate a token
				// and dispatch it to the client
				res.json(genToken(dbUserObj));
			}
		});
	},

	validate: function(username,password,callback){
		userModel.validateUser(username,password,function(err,result){
			if(err)
			{	
				callback(err,false);
			}
			else
			{
				callback(false,result);
			}
		});
	},
}



function genToken(user) {
	var expires = expiresIn(7); // 7 days
	var secret;
	var token = jwt.encode({
		exp: expires,
		first_name: user.first_name,
		middle_name: user.middle_name,
		last_name: user.last_name,
	}, require('config/secret.js')());
	return {
		token: token,
		expires: expires
	};
}


function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}



module.exports = auth;
