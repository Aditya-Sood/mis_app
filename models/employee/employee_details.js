/*
*@author rajatbajaj
*/

var user = require('models/user');
var db_tables = require('helper/db_tables');
var db = require('config/db');


//Initialising the required table_names
var user_details_table = db_tables.get('user_details_table');
var user_other_details_table = db_tables.get('user_other_details_table');
var user_address_table = db_tables.get('user_address_table');
var employee_basic_details_table = db_tables.get('employee_basic_details_table');
var employee_education_details_table = db_tables.get('employee_education_details_table');
var employee_family_details_table = db_tables.get('employee_family_details_table');
var employee_last_5_year_stay_table = db_tables.get('employee_last_5_year_stay_table');
var employee_pay_details_table = db_tables.get('employee_pay_details_table');
var employee_prev_exp_details_table = db_tables.get('employee_prev_exp_details_table');
var faculty_details_table = db_tables.get('faculty_details_table');

var personal_details,family_details,address_details,prev_exp_details,education_details,bank_details,employment_details,stay_details,pay_details;
var user_details,user_address_details,employee_details;


var employeeDetails = {
	getAllDetails : function(id,callback)
	{
		initializeVariables(id,function(err,result){
			if(err)
			{
				callback(err,result);
			}
			else
			{
				details = {};
				details['personal'] = user_details;
				details['address'] = user_address_details;
				if(getFamilyDetails(id))
				{
					console.log("1");
					details['family'] = family_details;
					if(getEducationDetails(id))
					{	
						console.log("2");
						details['education']  = education_details;
						if(getPayDetails(id))
						{
							console.log("3");
							details['pay'] = pay_details;
							if(getLast5YearStayDetails(id))
							{
								console.log("4");
								details['stay'] = stay_details;
								callback(null,details);
							}
							else
							{
								callback(true,{'err_code':2});
							}
						}
						else
						{
							callback(true,{'err_code':2});
						}
					}
					else
					{
						callback(true,{'err_code':2});
					}
				} 
				else
				{
					callback(true,{'err_code':2});
				}
			}
		});
	},
}


function initializeVariables(id,callback){
	//getting user details without address
	user.getUserDetailsById(id,function(err,result){
		if(err)
		{
			callback(err,{'err_code':6});
		}
		else
		{
			user_details = result;

			//getting user address
			user.getUserAddressDetailsById(id,function(err,result){
				if(err)
				{
					callback(err,{'err_code':6});
				}
				else
				{
					user_address_details = result;

					//getting student details
					getEmployeeDetailsById(id,function(err,result){
						if(err)
						{
							callback(err,{'err_code':6});
						}
						else
						{
							console.log(result);
							employee_details = result[0];
							callback(err=null,{'err_code':0});
						}
					});
				}
			});
		}
	});
}


function getEducationDetails(id)
{
	var query = "SELECT * FROM "+employee_education_details_table + " WHERE id = ?";
	params = [];
	params.push(id);
	db.query(query,params,function(err,result){
		if(!err) {education_details =  result;console.log(result);return true;}
		else false;
	});
}

function getPayDetails(id)
{
	var query = "SELECT * FROM "+employee_pay_details_table+" WHERE id = ?";
	params = [];
	params.push(id);
	db.query(query,params,function(err,result){
		if(!err) {pay_details=result;console.log(result);return true;}
		else return false;
	});
}

function getFamilyDetails(id)
{
	var query = "SELECT * FROM "+employee_family_details_table+ " WHERE id = ?";
	params = [];params.push(id);
	db.query(query,params,function(err,result){
		if(!err){ family_details = result;console.log(result);return true;}
		else return false;
	});
}

function getLast5YearStayDetails(id)
{
	var query = "SELECT * FROM "+employee_last_5_year_stay_table + " WHERE id = ?";
	params = [];params.push(id);
	db.query(query,params,function(err,result){
		if(!err){stay_details = result;console.log(result);return true;}
		else return false;
	});
}

function prevExpDetails(id)
{
	var query = "SELECT * FROM "+employee_prev_exp_details_table+" WHERE id = ?";
	params = [];
	params.push(id);
	db.query(query,params,function(err,result){
		if(!err){prev_exp_details = result;console.log(result);return true;}
		else return false;
	});
}


function getFullName(first_name,middle_name,last_name)
{
	if(middle_name == "")
	{
		return first_name+" "+last_name;
	}
	else
	{
		return first_name+" "+middle_name+" "+last_name;
	}
}


function getEmployeeDetailsById(id,callback)
{
	var query = "SELECT * FROM "+employee_basic_details_table+" INNER JOIN "+faculty_details_table+" ON emp_basic_details.id = faculty_details.id WHERE emp_basic_details.id = ?";
	params = [];
	params.push(id);
	db.query(query,params,callback);
}

module.exports = employeeDetails;