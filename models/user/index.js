var User = require('./user-model');
var db = require('config/db');
var db_tables = require('helper/db_tables');
var crypto = require('crypto');

//Users table name in the database
const user_table = db_tables.get('user_table');
const user_details_table = db_tables.get('user_details_table');
const user_other_details_table = db_tables.get('user_other_details_table');
const user_address_table = db_tables.get('user_address_table');
const employee_basic_details_table = db_tables.get('employee_basic_details_table');
const student_academic_details_table = db_tables.get('student_academic_details_table');
const user_login_attempts_table = db_tables.get('user_login_attempts_table');

var userModel = {
	validateUser: function(username,password,callback){
		
		row = getUserById(username,function(err,row){
			console.log(row);
			if(err){
				callback({'message' : 'Error in sql query'},false);
			}
			else
			{
				if(row.length== 1)
				{
					var acc_creation_date = row[0].created_date;
					//encoded_password = encodePassword(password,acc_creation_date);
					encoded_password = password;
					if(encoded_password == "p")
					{
						var auth = {};

						var result = convertIntoUserObjects(row);

						console.log(row[0].auth_id);

						if(row[0].auth_id == 'emp')
						{
							var emp_details = getEmployeeDetailsById(row[0].id,function(err,result){
								console.log(result);
								if(err)
								{
									callback(err,{'err_code':5,'err_msg':err.message});
								}
								else
								{
									row[0].designation = result[0].des_name;
									auth['1'] = row[0].auth_id;
									auth['2'] = result[0].auth_id;

									delete row[0].auth_id;
									row[0]['auth'] = auth;

									callback(err, row[0]);
								} 
							});
							
						}
						else if(row[0].auth_id == 'stu')
						{
							console.log("I am here");
							var stu_details = getStudentDetailsById(row[0].id,function(err,result){
								if(err)
								{
									callback(err,{'err_code':5,'err_msg':err.message});
								}
								else
								{
									console.log(result);
									row[0].branch_id = result[0].branch_id;
									row[0].course_id = result[0].course_id;
									row[0].semester = result[0].semester;

									auth['1'] = row[0].auth_id;
									auth['2'] = result[0].auth_id;

									delete row[0].auth_id;
									row[0]['auth'] = auth;
									console.log(row[0]);
									callback(err, row[0]);
								}
							});
							
						}
		        	}
		        	else
		        	{
		        		callback({'message':'Invalid Username or password'},false);
		        	}
	        	}
	        	else
	        	{
	        		//Not possible more than one row with same id
	        		callback({'message':'Two entries with same user exists'},{'err_code':4})
	        	}
			}
		});
	},

	getUserDetailsById : function(userid,callback){
		var query = "SELECT * FROM "+user_table+","+user_details_table+","+user_other_details_table+" WHERE users.id = user_details.id AND users.id = user_other_details.id AND users.id = ?";	
		console.log(query);
		var params = [];
		params.push(userid);

		db.query(query,params,function(err,result){
			if(err) 
			{
				callback(err,{});
			}
			else
			{
				delete result[0].password;
				callback(err,result[0]);
			}
		});	
	},

	getUserAddressDetailsById : function(userid,callback)
	{
		var query = "SELECT * FROM "+user_address_table+" WHERE id=? ORDER BY `id` DESC";
		console.log(query);
		var params = [];
		params.push(userid);

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
	},

	updateLoginTime : function(user_id,callback){
		var query = 'INSERT INTO '+user_login_attempts_table+'(id,time) VALUES(?,?)' ;
		var params = [];
		params.push(user_id);
		var dateTime = require('node-datetime');
		var dt = dateTime.create();
		var formatted = dt.format('Y-m-d H:M:S');
		params.push(formatted);
		db.query(query,params,callback);
	}

}


//algorithm used to encode the password before being entered to database
function encodePassword(password,created_date){
	var ts = Date.parse(created_date);	
	var d = new Date(created_date);    
	var year = d.getFullYear();
	var salt = 'ISM';

	var temp_hash = password + ts/1000 + salt;

	for(var i=0;i<year;i++)
	{
		temp_hash = crypto.createHash('md5').update(temp_hash).digest("hex");
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


//getting all the user_details using the user id
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


//getting employee specific details
function getEmployeeDetailsById(userid,callback)
{
	var query = "SELECT auth_id,d.name as des_name FROM "+ employee_basic_details_table +" AS e INNER JOIN designations AS d ON e.designation = d.id where e.emp_no = ?";
	var params = [];
	params.push(userid);

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

//getting student specific details
function getStudentDetailsById(userid,callback)
{
	console.log(userid);
	var query = "SELECT branch_id,course_id,semester,auth_id FROM " + student_academic_details_table + " WHERE admn_no = ?";
	console.log(query);
	var params = [];
	params.push(userid);

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