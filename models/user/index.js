var User = require('./user-model');
var db = require('config/db');
var crypto = require('crypto');

//Users table name in the database
const user_table = 'users';
const user_details_table = 'user_details';
const user_other_details_table = 'user_other_details';
const user_address_table = 'user_address';

var userModel = {
	validateUser: function(username,password,callback){
		
		row = getUserById(username,function(err,row){
			if(err){
				callback(err,{'err_code' : 1});
			}
			else
			{
				var acc_creation_date = row[0].created_date;
				encoded_password = encodePassword(password,acc_creation_date);
				//encoded_password = password;
				console.log(encoded_password);
				if(encoded_password == row[0].password)
				{
					console.log("Login Success full");
					var result = convertIntoUserObjects(row);
					console.log(result);
	        		callback(err, row[0]);
	        	}
	        	else
	        	{
	        		callback(err=true,{'err_code' : 2});
	        	}
			}
		});
	}

	
}

function encodePassword(password,created_date){
	var ts = Date.parse(created_date);
	
	var d = new Date("2015-03-31T20:42:21.000Z");
    
	var year = d.getFullYear();
	var salt = 'ISM';

	console.log(ts);
	console.log(year);
	console.log(salt);

	var temp_hash = password + ts/1000 + salt;
	console.log(temp_hash);

	for(var i=0;i<year;i++)
	{
		temp_hash = crypto.createHash('md5').update(temp_hash).digest("hex");
		console.log(temp_hash);
	} 

	return temp_hash;
}


// abstraction for converting each row object into user object
// for better modularity
function convertIntoUserObjects(rows) {
    var userObjects = [];
    rows.forEach( function(item) {
        var user = new User();
        user.setId(item.id)
            .setSalutation(item.salutation)
            .setFirstName(item.first_name)
            .setMiddleName(item.middle_name)
            .setLastName(item.last_name)
            .setSex(item.sex)
            .setEmail(item.email)
            .setPicpath(item.photopath)
            .setRole(item.role)
            .setAddress(item.city, item.state, item.country, item.pincode)
            .setContactNo(item.contactNo)
            .setDepartment(item.dept_name, item.dept_typ);
        userObjects.push(user);
    });
    return userObjects;
}


function getUserById(username,callback)
{
	var query = "SELECT u . * , d.name AS dept_name, d.type AS dept_typ FROM ( SELECT * FROM "+user_table+" NATURAL JOIN "+user_details_table+" WHERE id = ?  ) AS u, departments AS d WHERE u.dept_id = d.id";
	var params = [];
	params.push(username);
	
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


module.exports = userModel;


