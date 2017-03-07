/*
@author rajatbajaj
*/

var db = require('config/db');
var db_tables = require('helper/db_tables');
var async = require('async');
var edit_user_model = require('models/user/edit_user_model');

var emp_validation_details_table = db_tables.get('emp_validation_details_table');
var emp_basic_details_table = db_tables.get('emp_basic_details_table');
var faculty_details_table = db_tables.get('faculty_details_table');

function updateEmpBasicDetailsById(data,emp_no,callback)
{
	var query = "UPDATE "+emp_basic_details_table+" SET office_no = ? AND fax = ? WHERE emp_no = ?";
	var params = [];
	params.push(data['office_no']);
	params.push(data['fax']);
	params.push(data['emp_no']);
	db.query(query,params,callback);
}

function updateFacultyDetailsById(data,emp_no,callback)
{
	var query = "UPDATE "+faculty_details_table+" SET research_interest = ? WHERE emp_no = ?";
	var params = [];
	params.push(data['research_interest']);
	params.push(emp_no);
	db.query(query,params,callback);
}

function updatePendingEmpBasicDetailsById(data,emp_no,callback)
{
	var query = "UPDATE "+emp_basic_details_table+" SET office_no = ? AND fax = ? WHERE emp_no = ?";
	var params = [];
	params.push(data['office_no']);
	params.push(data['fax']);
	params.push(data['emp_no']);
	db.query(query,params,callback);
}

function updatePendingFacultyDetailsById(data,emp_no,callback)
{
	var query = "UPDATE "+faculty_details_table+" SET research_interest = ? WHERE emp_no = ?";
	var params = [];
	params.push(data['research_interest']);
	params.push(emp_no);
	db.query(query,params,callback);
}

function editSelfDetails(req_data,emp_no,callback)
{
	var emp_details = {};
	emp_details['user_details'] = {};
	emp_details['user_other_details'] = {};
	emp_details['emp_basic_details'] = {};

	emp_details['user_details'] = {'salutation' : req_data.salutation,
								'email':req_data.email,
								'marital_status':req_data.marital_status.toLowerCase(),
								'physically_challenged':req_data.pd.toLowerCase()};

	emp_details['user_other_details'] = {'hobbies' : req_data.hobbies.toLowerCase(),
										 'fav_past_time' : req_data.fav_past_time.toLowerCase(),
										 'mobile_no' : req_data.mobile,
										 'bank_name' : req_data.bank_name,
										 'bank_acco' : req_data.bank_acco
										};							

	emp_details['emp_basic_details'] = {
										'office_no':req_data.office_no,
										'fax':req_data.fax
										};

	if(req_data.research_int)
	{
		emp_details['faculty_details'] = {'research_interest':req_data.research_int.toLowerCase()};
	}

	emp_details['user_present_address'] = {
											'line1':req_data.line11,
											'line2':req_data.line21,
											'city':req_data.city1,
											'state':req_data.state1,
											'pincode':req_data.pincode1,
											'country':req_data.country1,
											'contact_no':req_data.contact1
											};		

	var parallel_tasks = [];
	parallel_tasks.push(function(callbck){
		edit_user_model.updateUserDetailsById(emp_details['user_details'],emp_no,callbck);
	});


	parallel_tasks.push(function(callbck){
		edit_user_model.updateUserOtherDetailsById(emp_details['user_other_details'],emp_no,callbck);
	});


	parallel_tasks.push(function(callbck){
		updateEmpBasicDetailsById(emp_details['emp_basic_details'],emp_no,callbck);
	});

	if(emp_details['faculty_details'])
	{
		parallel_tasks.push(function(callbck){
			updateFacultyDetailsById(emp_details['faculty_details'],emp_no,callbck);		
		});
	}
	
	parallel_tasks.push(function(callbck){
		edit_user_model.updateUserPresentAddressById(emp_details['user_details'],emp_no,callbck);
	});


	async.parallel(parallel_tasks,function(err,result){
		if(err) callback(err,result);
		else{
			getEmployeeValidationDetails(emp_no,function(err,result){
				if(err) callback(err,result);
				else{
					var parallel_tasks = [];
					parallel_tasks.push(function(callbck){
						edit_user_model.updatePendingUserDetailsById(emp_details['user_details'],emp_no,callbck);
					});


					parallel_tasks.push(function(callbck){
						edit_user_model.updatePendingUserOtherDetailsById(emp_details['user_other_details'],emp_no,callbck);
					});


					parallel_tasks.push(function(callbck){
						updatePendingEmpBasicDetailsById(emp_details['emp_basic_details'],emp_no,callbck);
					});

					if(emp_details['faculty_details'])
					{
						parallel_tasks.push(function(callbck){
							updatePendingFacultyDetailsById(emp_details['faculty_details'],emp_no,callbck);		
						});
					}
					
					parallel_tasks.push(function(callbck){
						edit_user_model.updatePendingUserPresentAddressById(emp_details['user_details'],emp_no,callbck);
					});

					async.parallel(parallel_tasks,callback);
				}
			});		
		}
	});
	

}

function getEmployeeValidationDetails(emp_id,callback)
{
	var query = "SELECT * FROM "+emp_validation_details_table+" WHERE emp_id = ?";
	var params = [];
	params.push(emp_id);
	db.query(query,params,callback);
}


var editEmployeeDetails = {
	editSelfDetails:editSelfDetails
};


module.exports = editEmployeeDetails; 