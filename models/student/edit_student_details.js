/*
* @author rajatbajaj
*/

var db = require('config/db');
var db_tables = require('helper/db_tables');
var edit_user_model = require('models/user/edit_user_model');
var async = require('async');

var stu_id_status_details_table = db_tables.get('stu_id_status_details_table');
var student_details_table = db_tables.get('student_details_table');
var student_other_details_table = db_tables.get('student_other_details_table');
var student_fee_details_table = db_tables.get('student_other_details_table');
var student_academic_details_table = db_tables.get('student_academic_details_table');
var student_education_details_table = db_tables.get('student_education_details_table');


function getStudentStatusById(id,callback)
{
	var query = "SELECT * FROM "+stu_id_status_details_table+" WHERE admn_no = ?";
	var params = [];
	params.push(id);
	db.query(query,params,callback);
}

function updateStudentDetailsById(data,id,callback)
{
	var query = "UPDATE "+student_details_table+" SET admn_date = ? AND enrollment_no = ? AND identification_mark = ? AND parent_mobile_no = ? AND parent_landline_no =? AND alternate_email_id = ? AND migration_cert = ? AND name_in_hindi = ? AND blood_group = ? WHERE admn_no = ?";
	var params = [];
	params.push(data['admn_date']);
	params.push(data['enrollment_no']);
	params.push(data['identification_mark']);
	params.push(data['parent_mobile_no']);
	params.push(data['parent_landline_no']);
	params.push(data['alternate_email_id']);
	params.push(data['migration_cert']);
	params.push(data['name_in_hindi']);
	params.push(data['blood_group']);
	params.push(id);
	db.query(query,params,callback);
}

function updateStudentOtherDetailsById(data,id,callback)
{
	var query = "UPDATE "+student_other_details_table+" SET bank_name = ? AND account_no = ? AND aadhaar_card_no = ? AND extra_curricular_activity = ? AND other_relevant_info = ? WHERE admn_no = ?"
	var params = [];
	params.push(data['bank_name']);
	params.push(data['account_no']);
	params.push(data['aadhaar_card_no']);
	params.push(data['extra_curricular_activity']);
	params.push(data['other_relevant_info']);
	params.push(id);
	db.qeury(query,params,callback);
}

function updateStudentEducationDetailsById(data,id,callback)
{
	var series_tasks = [];
	series_tasks.push(function(callbck){
		var query = "DELETE FROM "+student_education_details_table+ " WHERE admn_no = ?";
		var params = [];
		params.push(id);
		db.query(query,params,callbck);
	});

	series_tasks.push(function(callbck){
		var query = "INSERT INTO "+student_education_details_table+ " (admn_no,sno,exam,specialization,institute,year,grade,division) VALUES(?,?,?,?,?,?,?,?)";
		var params = [];
		params.push(id);
		params.push(data[0]['sno']);
		params.push(data[0]['exam']);
		params.push(data[0]['specialization']);
		params.push(data[0]['institute']);
		params.push(data[0]['year']);
		params.push(data[0]['grade']);
		params.push(data[0]['division']);
		db.query(query,params,callbck);
	});


	series_tasks.push(function(callbck){
		var query = "INSERT INTO"+student_education_details_table+ " WHERE admn_no = ? AND sno = ? AND exam = ? AND specialization = ? AND institute = ? AND year = ? AND grade = ? AND division = ?";
		var params = [];
		params.push(id);
		params.push(data[1]['sno']);
		params.push(data[1]['exam']);
		params.push(data[1]['specialization']);
		params.push(data[1]['institute']);
		params.push(data[1]['year']);
		params.push(data[1]['grade']);
		params.push(data[1]['division']);
		db.query(query,params,callbck);
	});

	async.series(series_tasks,callback);
}

function updateStudentFeeDetailsById(data,id,callback)
{
	var query = "UPDATE "+student_fee_details_table+" SET fee_mode = ? AND fee_amount = ? AND payment_made_on = ? AND transaction_id = ? WHERE admn_no = ?";
	params.push(data['fee_mode']);
	params.push(data['fee_amount']);
	params.push(data['payment_made_on']);
	params.push(data['transaction_id']);
	params.push(id);
	db.query(query,params,callback);
}

function updateStudentAcademicDetailsByid(data,id,callback)
{
	var query = "UPDATE "+student_academic_details_table+" SET enrollment_year = ? AND admn_based_on = ? AND iit_jee_rank = ? AND iitjee_cat_rank = ? AND cat_score = ? AND gate_score = ? AND other_rank = ? WHERE admn_no = id";
	params.push(data['enrollment_year']);
	params.push(data['admn_based_on']);
	params.push(data['iitjee_rank']);
	params.push(data['iitjee_cat_rank']);
	params.push(data['cat_score']);
	params.push(data['gate_score']);
	params.push(data['other_rank']);
	params.push(id);
	db.query(query,params,callback);
}

function updateAllDetails(req_data,callback){

	var user_details = {
		'salutation' : req_data.salutation,
		'first_name' : req_data.first_name,
		'middle_name' : req_data.middle_name,
		'last_name' : req_data.last_name,
		'sex' : req_data.sex,
		'category' :  req_data.category,
		'dob' : req_data.dob,
		'email' : req_data.email,
		'marital_status' : req_data.mstatus,
		'physically_challenged' : req_data.pd,
		'dept_id' : req_data.dept_id
	};

	var user_other_details = {
		'religion' : req_data.religion.toLowerCase(),
		'nationality' : req_data.nationality.toLowerCase(),
		'kashmiri_immigrant' : req_data.kashmiri,
		'hobbies' : req_data.hobbies,
		'fav_past_time' : req_data.fav_past,
		'birth_place' : req_data.pob,
		'mobile_no' : req_data.mobile,
		'father_name' : req_data.father_name,
		'mother_name' : req_data.mother_name	
	};

	var admn_based_on = req_data.admn_based_on;
	var iitjee_rank = req_data.iitjee_rank;
	var iitjee_cat_rank = req_data.iitjee_cat_rank;
	var cat_score = req_data.cat_score;
	var gate_score = req_data.gate_score;
	var other_rank = req_data.other_rank;	

	if(admn_based_on == 'others')
	{
		admn_based_on = req_data.mode_of_admission,
		iitjee_rank = '0',
		iitjee_cat_rank = '0',
		cat_score = '0',
		gate_score = '0'
	} 
	else if (admn_based_on == 'iitjee')
	{
		cat_score = '0',
		gate_score = '0',
		other_rank = '0'
	}
	else if(admn_based_on == 'gate')
	{
		iitjee_rank = '0',
		iitjee_cat_rank = '0',
		cat_score = '0',
		other_rank = '0'
	}
	else if(admn_based_on == 'cat')
	{
		iit_jee_rank = '0';
		iit_jee_cat_rank = '0';
		gate_score = '0';
		other_rank = '0';
	}
	else {
		iitjee_rank = '0',
		iitjee_cat_rank = '0',
		cat_score = '0',
		gate_score = '0',
		other_rank = '0'
	}

	var stu_details = {
		'admn_date' : req_data.entrance_date,
		'enrollment_no' : req_data.roll_no,
		'identification_mark' : req_data.identification_mark,
		'parent_mobile_no' : req_data.parent_mobile_no,
		'parent_landline_no' : req_data.parent_landline_no,
		'alternate_email_id' : req_data.alternate_email_id,
		'migration_cert' : req_data.migration_cert,
		'name_in_hindi' : req_data.stud_name_hindi,
		'blood_group' : req_data.blood_group
	};

	var stu_fee_details = {
		'fee_mode' :  req_data.fee_paid_mode,
		'fee_amount' : req_data.fee_paid_amount,
		'payment_made_on': req_data.fee_paid_date,
		'transaction_id' : req_data.transaction_id	
	};	

	var stu_other_details = {
		'bank_name' : req_data.bank_name,
		'account_no' : req_data.account_no,
		'aadhaar_card_no' : req_data.aadhaar_no,
		'extra_curricular_activity' : req_data.extra_activity,
		'other_relevant_info' : req_data.any_other_info
	};

	var stu_academic_details = {
		'enrollment_year' : req_data.entrance_date,
		'admn_based_on' : admn_based_on,
		'iitjee_rank' : req_data.iitjee_rank,
		'iitjee_cat_rank' : req_data.iitjee_cat_rank,
		'cat_score' : req_data.cat_score,
		'gate_score' : req_data.gate_score,
		'other_rank' : req_data.other_rank
	};

	var stu_education_details = [
		{
			'exam' : req_data.exam1,
			'specialization' : req_data.specialization1,
			'institute' : req_data.institute1,
			'year' : req_data.year1,
			'grade' : req_data.grade1,
			'division' : req_data.division1,
			'sno' : '1'
		},
		{
			'exam' : req_data.exam2,
			'specialization' : req_data.specialization2,
			'institute' : req_data.institute2,
			'year' : req_data.year2,
			'grade' : req_data.grade2,
			'division' : req_data.division2,
			'sno' : '2'
		}
	];

	var user_address;

	if(req_data.correspondence_addr)
	{
		user_address = [
			{
				'line1':req_data.line11,
				'line2':req_data.line21,
				'city':req_data.city1,
				'state':req_data.state1,
				'pincode':req_data.pincode1,
				'country':req_data.country1,
				'contact_no':req_data.contact1,
				'type':'present'
			},
			{
				'line1':req_data.line12,
				'line2':req_data.line22,
				'city':req_data.city2,
				'state':req_data.state2,
				'pincode':req_data.pincode2,
				'country':req_data.country2,
				'contact_no':req_data.contact2,
				'type':'permanent'
			}	
		];
	}
	else{
		user_address = [
			{
				'line1':req_data.line11,
				'line2':req_data.line21,
				'city':req_data.city1,
				'state':req_data.state1,
				'pincode':req_data.pincode1,
				'country':req_data.country1,
				'contact_no':req_data.contact1,
				'type':'present'
			},
			{
				'line1':req_data.line12,
				'line2':req_data.line22,
				'city':req_data.city2,
				'state':req_data.state2,
				'pincode':req_data.pincode2,
				'country':req_data.country2,
				'contact_no':req_data.contact2,
				'type':'permanent'
			},
			{
				'line1':req_data.line13,
				'line2':req_data.line23,
				'city':req_data.city3,
				'state':req_data.state3,
				'pincode':req_data.pincode3,
				'country':req_data.country3,
				'contact_no':req_data.contact3,
				'type':'correspondence'	
			}	
		];	
	}

	var parallel_tasks = [];

	parallel_tasks.push(function(callbck){
		edit_user_model.updateUserDetailsById(user_details,admn_no,callbck);
	});

	parallel_tasks.push(function(callbck){
		edit_user_model.updateUserOtherDetailsById(user_other_details,admn_no,callbck);
	});

	parallel_tasks.push(function(callbck){
		edit_user_model.updateUserPermanentAddressById(user_address[1],admn_no,callbck);
	});

	parallel_tasks.push(function(callbck){
		edit_user_model.updateUserPresentAddressById(user_address[0],admn_no,callbck);
	});

	if(user_address[2])
	{
		parallel_tasks.push(function(callbck){
			edit_user_model.updateUserCorrespondenceAddressById(user_address[2],admn_no,callbck);
		});
	}

	parallel_tasks.push(function(callbck){
		updateStudentDetailsById(stu_details,admn_no,callbck);
	});

	parallel_tasks.push(function(callbck){
		updateStudentAcademicDetailsByid(student_academic_details,admn_no,callbck);
	});

	parallel_tasks.push(function(callbck){
		updateStudentFeeDetailsById(stu_fee_details,admn_no,callbck);
	});	

	parallel_tasks.push(function(callbck){
		updateStudentEducationDetailsById(stu_education_details,admn_no,callbck);
	});

	parallel_tasks.push(function(callbck){
		updateStudentOtherDetailsById(stu_other_details,admn_no,callbck);
	});

	async.parallel(parallel_tasks,callback);
}

var editStudentDetails = {
	updateAllDetails:updateAllDetails
};

module.exports = editStudentDetails;