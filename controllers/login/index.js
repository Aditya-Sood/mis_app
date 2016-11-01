var jwt = require('jwt-simple');
var userModel = require('models/user');
var specs = require('config/specs');

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
			if(err)
			{
				res.status(401);
				res.json({
				"status": 401,
				"err_code": 2
				});
				return;
			}

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

	/*
	*validating the password and the username using the validateUser function defined in the user-model.js in user model
	*/
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


/*
*generating the jwt(json web token) for the user authentication(this is subsitute of the cookies used in mis web app)
*secret key is used defined in config/secret.js
*set the expiry time for the token 
*token consist of three parts (a.b.c)
*(a) base64encode({'typ':'jwt','alg':'ALGO_USED_TO_GEN_TOKEN'})
*(b) base64encode({user})
*(c) base64encode(hash(a+b+secret)) for checksum
*/
function genToken(user) {
	delete user.password;

	var expires = expiresIn(specs.get('TOKEN_EXPIRE_TIME')); // 1 minute(approx.) == 0.0006 days
	var secret;
	var token = jwt.encode({
		exp: expires,
		user: user
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
