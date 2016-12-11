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
				getFamilyDetails(id,function(err,result){
					if(!err)
					{
						console.log("1");
						details['family'] = family_details = result;
						getEducationDetails(id,function(err,result){
							if(!err)
							{	
								console.log("2");
								details['education']  = education_details = result;
								getPayDetails(id,function(err,result){
									if(!err)
									{
										console.log("3");
										details['pay'] = pay_details = result;
										getLast5YearStayDetails(id,function(err,result){
											if(!err)
											{
												console.log("4");
												details['stay'] = stay_details = result;
												callback(null,details);
											}
											else
											{
												callback(true,{'err_code':2,'err_message':err.message});
											}
										});
									}
									else
									{
										callback(true,{'err_code':2,'err_message':err.message});
									}
								});
							}
							else
							{
								callback(true,{'err_code':2,'err_message':err.message});
							}
						});
					} 
					else
					{
						callback(true,{'err_code':2,'err_message':err.message});
					}
				});
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
					callback(err,{'err_code':6,'err_msg':err.message});
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
							employee_details = result[0];
							callback(err=null,{'err_code':0});
						}
					});
				}
			});
		}
	});
}


function getEducationDetails(id,callback)
{
	var query = "SELECT * FROM "+employee_education_details_table + " WHERE emp_no = ?";
	params = [];
	params.push(id);
	db.query(query,params,callback);
}

function getPayDetails(id,callback)
{
	var query = "SELECT * FROM "+employee_pay_details_table+" WHERE emp_no = ?";
	params = [];
	params.push(id);
	db.query(query,params,callback);
}

function getFamilyDetails(id,callback)
{
	var query = "SELECT * FROM "+employee_family_details_table+ " WHERE emp_no = ?";
	params = [];params.push(id);
	db.query(query,params,callback);
}

function getLast5YearStayDetails(id,callback)
{
	var query = "SELECT * FROM "+employee_last_5_year_stay_table + " WHERE emp_no = ?";
	params = [];params.push(id);
	db.query(query,params,callback);
}

function prevExpDetails(id,callback)
{
	var query = "SELECT * FROM "+employee_prev_exp_details_table+" WHERE emp_no = ?";
	params = [];
	params.push(id);
	db.query(query,params,callback);
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
	var query = "SELECT * FROM "+employee_basic_details_table+" INNER JOIN "+faculty_details_table+" ON emp_basic_details.emp_no = faculty_details.emp_no WHERE emp_basic_details.emp_no = ?";
	params = [];
	params.push(id);
	db.query(query,params,callback);
}

module.exports = employeeDetails;