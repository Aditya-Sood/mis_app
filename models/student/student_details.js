/*
 *@author rajatbajaj
*/

/*
 *this model fetches all the details of the student from the database
*/
var user = require('models/user');
var db_tables = require('helper/db_tables');
var db = require('config/db');
var gen_api = require('models/general');	
var step = require('step');
var async = require('async');

//Initialising the required table_names
var user_details_table = db_tables.get('user_details_table');
var user_other_details_table = db_tables.get('user_other_details_table');
var student_details_table = db_tables.get('student_details_table');
var student_other_details_table = db_tables.get('student_other_details_table');
var student_fee_details_table = db_tables.get('student_fee_details_table');
var user_address_table = db_tables.get('user_address_table');
var student_education_details_table = db_tables.get('student_education_details_table');
var student_academic_details_table = db_tables.get('student_academic_details_table');

var personal_details={},family_details,address_details,education_details,bank_details,fee_details,admission_details;
var user_details,user_address_details,student_details;

var studentDetails = {
	getAllDetails : function(adm_no,callback){
		initializeVariables(adm_no,function(err,result){
			if(err)
			{
				callback(err,result);
			}
			else
			{
				var details = {};
				step(
					getPersonalDetails(),
					getFamilyDetails(),
					getAddressDetails(),
					getEducationalDetails(),
					getAdmissionDetails(),
					getFeeDetails(),
					getBankDetails(),
					function(){
						details['personal'] = personal_details;
						details['family'] = family_details;
						details['address'] = address_details;
						details['admission'] = admission_details;
						details['education'] = education_details;
						details['fee'] = fee_details;
						details['bank'] = bank_details;
						callback(err=null,details);
					}
				);
			}
		});
	},
	
}

function getPersonalDetails(){
	//get the personal details attributes
	personal_details['id'] = user_details.id;
	personal_details['name'] = getFullName(user_details.first_name,user_details.middle_name,user_details.last_name);
	personal_details['gender'] = user_details.sex;
	personal_details['birth_place'] = user_details.birth_place;
	personal_details['blood_group'] = student_details[0].blood_group;
	personal_details['marital_status'] = user_details.marital_status;
	personal_details['religion'] = user_details.religion;
	personal_details['aadhar_card'] = student_details[0].aadhaar_card_no;
	personal_details['name_in_hindi'] = student_details[0].name_in_hindi;
	personal_details['dob'] = user_details.dob;
	personal_details['physically_challenged'] = user_details.physically_challenged;
	personal_details['kashmiri_immigrant'] = user_details.kashmiri_immigrant;
	personal_details['category'] = user_details.category;
	personal_details['nationality'] = user_details.nationality;
	personal_details['identification_mark'] = student_details[0].identification_mark;
	personal_details['image_path'] = user_details.photopath;

	//callback(err=null,personal_details);

}

function getFamilyDetails(){
	//get the family related attributes from data
	family_details = {};
	family_details['father_name'] = user_details.father_name;
	family_details['father_occupation'] = student_details[0].fathers_occupation;
	family_details['father_gross_income'] = student_details[0].fathers_annual_income;
	family_details['gaurdian_name'] = student_details[0].gaurdian_name;
	family_details['parent_mobile_no'] = student_details[0].parent_mobile_no;
	family_details['mother_name'] = user_details.mother_name;
	family_details['mother_occupation'] = student_details[0].mothers_occupation;
	family_details['mother_gross_income'] = student_details[0].mothers_annual_income;
	family_details['gaurdian_relation'] = student_details[0].gaurdian_relation;
	family_details['parent_landline'] = student_details[0].parent_landline_no;

	//callback(err=null,family_details);
}

function getAddressDetails(){

	address_details = {};
	address_details_present = {};
	address_details_permanent = {};
	address_details_present['line1'] = user_address_details[1].line1;		
	address_details_present['line2'] = user_address_details[1].line2;
	address_details_present['city'] = user_address_details[1].city;
	address_details_present['state'] = user_address_details[1].state;
	address_details_present['pincode'] = user_address_details[1].pincode;
	address_details_present['country'] = user_address_details[1].country;
	address_details_present['contact_no'] = user_address_details[1].contact_no;
	
	address_details_permanent['line1'] = user_address_details[0].line1;		
	address_details_permanent['line2'] = user_address_details[0].line2;
	address_details_permanent['city'] = user_address_details[0].city;
	address_details_permanent['state'] = user_address_details[0].state;
	address_details_permanent['pincode'] = user_address_details[0].pincode;
	address_details_permanent['country'] = user_address_details[0].country;
	address_details_permanent['contact_no'] = user_address_details[0].contact_no;
	
	address_details['present'] = address_details_present;
	address_details['permanent'] = address_details_permanent;

//	callback(err=null,address_details);
}

function getEducationalDetails(){
	education_details = {};
	education_details_X = {};
	education_details_XII = {};

	education_details_X['exam'] = student_details[0]['exam'];
	education_details_X['branch'] = student_details[0]['branch'];
	education_details_X['institute'] = student_details[0]['institute'];
	education_details_X['year'] = student_details[0]['year'];
	education_details_X['grade'] = student_details[0]['grade'];
	education_details_X['division'] = student_details[0]['division'];


	education_details_XII['exam'] = student_details[1]['exam'];
	education_details_XII['branch'] = student_details[1]['branch'];
	education_details_XII['institute'] = student_details[1]['institute'];
	education_details_XII['year'] = student_details[1]['year'];
	education_details_XII['grade'] = student_details[1]['grade'];
	education_details_XII['division'] = student_details[1]['division'];

	education_details['X'] = education_details_X;
	education_details['XII'] = education_details_XII;

//	callback(err=null,education_details);

}

function getAdmissionDetails(){
	admission_details = {};
	admission_details['migration_certificate'] = student_details[0].migration_cert; 
	admission_details['date_of_admission'] = student_details[0].admn_date;
	admission_details['iit_jee_rank'] = student_details[0].iit_jee_rank;
	admission_details['gate_score'] = student_details[0].gate_score;
	admission_details['stu_type'] = student_details[0].type;
	admission_details['roll_no'] = student_details[0].enrollment_no;
	admission_details['admn_based_on'] =student_details[0].admn_based_on;
	admission_details['category_rank'] = student_details[0].iit_jee_cat_rank
	admission_details['cat_score'] = student_details[0].cat_score;
	admission_details['current_semester'] = student_details[0].semester;
	admission_details['department'] = student_details[0].department;
	admission_details['course'] = student_details[0].course;
	admission_details['branch'] = student_details[0].branch;

}

function getBankDetails(){
	bank_details = {};
	bank_details['bank_name'] = student_details[0].bank_name;
	bank_details['acc_no'] = student_details[0].account_no;

	//callback(err=null,bank_details);
}

function getFeeDetails(){
	fee_details = {};
	fee_details['mode_of_payment'] = student_details[0].fee_mode;
	fee_details['dd_no'] = student_details[0].transaction_id;
	fee_details['date'] = student_details[0].payment_made_on;
	fee_details['amount'] = student_details[0].fee_amount;

	//callback(err=null,fee_details);
}

function initializeVariables(adm_no,callback){


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
							console.log(result);
							student_details = result;
							callback(err=null,{'err_code':0});
						}
					});
				}
			});
		}
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

function getStudentDetailsById(stu_id,callback){
	var query = "SELECT * FROM "+student_details_table+","+student_other_details_table+","+student_academic_details_table+","+student_fee_details_table+","+student_education_details_table+" WHERE stu_details.admn_no = stu_other_details.id AND stu_details.admn_no=stu_fee_details.id AND stu_details.admn_no = stu_academic.id AND stu_details.admn_no = stu_education_details.id AND stu_details.admn_no=?";
	var params = [];
	params.push(stu_id);

	db.query(query,params,function(err,result){
		if(err) 
		{
			callback(err,{'err_code':6});
		}
		else
		{
			gen_api.getDepartmentNameById(result[0].branch_id,function(err,result1){
				//console.log(result);
				if(err)
				{
					callback(err,{'err_code':6});
				}else
				{
					result[0]['department'] = result1.name;
					gen_api.getCourseNameById(result[0].course_id,function(err,result2){
						if(err)
						{
							callback(err,{'err_code':6});
						}else
						{
							result[0]['course'] = result2.name;
							gen_api.getDepartmentNameById(result[0].branch_id,function(err,result3){
								if(err)
								{
									callback(err,{'err_code':6});
								}else
								{
									result[0]['branch'] = result3.name;
									callback(err,result);
								}
							});
						}
					});
				}
			});
		}
	});	
}



module.exports = studentDetails;
