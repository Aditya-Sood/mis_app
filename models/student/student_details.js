/*
* @author rajatbajaj
*/

/*
*this model fetches all the details of the student from the database
*/


var user = require('models/user');
var db_tables = require('helper/db_tables');
var db = require('config/db');	


//Initialising the required table_names
var user_details_table = db_tables.get('user_details_table');
var user_other_details_table = db_tables.get('user_other_details_table');
var student_details_table = db_tables.get('student_details_table');
var student_other_details_table = db_tables.get('student_other_details_table');
var user_address_table = db_tables.get('user_address_table');
var student_education_details_table = db_tables.get('student_education_details_table');
var student_academic_details_table = db_tables.get('student_academic_details_table');

var personal_details,family_details,address_details,education_details,bank_details,fee_details;
var user_details,user_address_details,student_details;

var studentDetails = {
	getAllDetails : function(adm_no,callback){

	},

	getPersonalDetails: function(adm_no,callback){
		console.log('------------------');
		console.log(user_details);
		temp = [];
		temp.push(user_details);
		temp.push(user_address_details);
		temp.push(student_details);
		callback(err=null,temp);
	},

	getFamilyDetails: function(adm_no,callback){

	},

	getAddressDetails: function(adm_no,callback){

	},

	getEducationalDetails: function(adm_no,callback){

	},

	getAdmissionDetails: function(adm_no,callback){

	},

	getBankDetails: function(adm_no,callback){

	},

	getFeeDetails: function(adm_no,callback){

	},

	initializeVariables: function(adm_no,callback){


		//getting user details without address
		user.getUserDetailsById(adm_no,function(err,result){
			if(err)
			{
				callback(err,{'err_code':6});
			}
			else
			{
				user_details = result;

				//getting user address
				user.getUserAddressDetailsById(adm_no,function(err,result){
					if(err)
					{
						callback(err,{'err_code':6});
					}
					else
					{
						user_address_details = result;

						//getting student details
						getStudentDetailsById(adm_no,function(err,result){
							if(err)
							{
								callback(err,{'err_code':6});
							}
							else
							{
								student_details = result;
								callback(err=null,{'err_code':0});
							}
						});
					}
				});

			}
		});

	},
}

function getStudentDetailsById(stu_id,callback){
	var query = "SELECT * FROM "+student_details_table+","+student_other_details_table+","+student_academic_details_table+","+student_education_details_table+" WHERE stu_details.admn_no = stu_other_details.id AND stu_details.admn_no = stu_academic.id AND stu_details.admn_no = stu_education_details.id AND stu_details.admn_no=?";
	var params = [];
	params.push(stu_id);

	db.query(query,params,function(err,result){
		if(err) 
		{
			callback(err,{'err_code':6});
		}
		else
		{
			callback(err,result);
		}
	});	
}


module.exports = studentDetails;
