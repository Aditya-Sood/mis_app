/*
*@author rajatbajaj
*/

var db = require('config/db');
var db_tables = require('helper/db_tables');
var user_details_table = db_tables.get('user_details_table');
var user_other_details_table = db_tables.get('user_other_details_table');
var user_address_table = db_tables.get('user_address_table');

function updateUserDetailsById(data,id,callback)
{
	var query = "UPDATE "+user_details_table+" SET salutation = ? AND email = ? AND marital_status = ? AND physically_challenged = ? WHERE id = ?";
	var params = [];
	params.push(data['salutation']);
	params.push(data['email']);
	params.push(data['marital_status']);
	params.push(data['physically_challenged']);
	params.push(id);
	db.query(query,params,callback);
}

function updateUserOtherDetailsById(data,id,callback)
{
	var query = "UPDATE "+user_other_details_table+" SET hobbies = ? AND fav_past_time = ? AND mobile_no = ? AND bank_name = ? AND bank_accno = ? WHERE id = ?";
	var params = [];
	params.push(data['hobbies']);
	params.push(data['fav_past_time']);
	params.push(data['mobile_no']);
	params.push(data['bank_name']);
	params.push(data['bank_accno']);
	params.push(id);
	db.query(query,params,callback);
}

function updateUserPresentAddressById(data,id,callback)
{
	var query = "UPDATE "+user_address_table+ " SET line1 = ? AND line2 = ? AND city = ? AND state = ? AND pincode =? AND country = ? AND contact_no = ? WHERE id = ? AND type = ?";
	var params  = [];
	params.push(data['line1']);
	params.push(data['line2']);
	params.push(data['city']);
	params.push(data['state']);
	params.push(data['pincode']);
	params.push(data['country']);
	params.push(data['contact_no']);
	params.push(id);
	params.push('present');
	db.query(query,params,callback);
}

function updateUserPermanentAddressById(data,id,callback)
{
	var query = "UPDATE "+user_address_table+ " SET line1 = ? AND line2 = ? AND city = ? AND state = ? AND pincode =? AND country = ? AND contact_no = ? WHERE id = ? AND type = ?";
	var params  = [];
	params.push(data['line1']);
	params.push(data['line2']);
	params.push(data['city']);
	params.push(data['state']);
	params.push(data['pincode']);
	params.push(data['country']);
	params.push(data['contact_no']);
	params.push(id);
	params.push('permanent');
	db.query(query,params,callback);
}

function updateUserCorrespondenceAddressById(data,id,callback)
{
	var series_tasks = [];
	series_tasks.push(function(callbck){
		var query = "DELETE FROM "+user_address_table+" WHERE id = ? AND type = 'correspondence'";
		var params = [];
		params.push(id);
		db.query(query,params,callbck);
	});

	series_tasks.push(function(callbck){
		var query = "INSERT INTO "+user_address_table+ "(line1,line2,city,state,pincode,country,contact_no,id,type) VALUES(?,?,?,?,?,?,?,?,?)";
		var params  = [];
		params.push(data['line1']);
		params.push(data['line2']);
		params.push(data['city']);
		params.push(data['state']);
		params.push(data['pincode']);
		params.push(data['country']);
		params.push(data['contact_no']);
		params.push(id);
		params.push('correspondence');
		db.query(query,params,callbck);
	});
	
	async.series(series_tasks,callback);	
}

function updatePendingUserDetailsById(data,id,callback)
{
	var query = "UPDATE pending_"+user_details_table+" SET salutation = ? AND email = ? AND marital_status = ? AND physically_challenged = ? WHERE id = ?";
	var params = [];
	params.push(data['salutation']);
	params.push(data['email']);
	params.push(data['marital_status']);
	params.push(data['physically_challenged']);
	params.push(id);
	db.query(query,params,callback);
}

function updatePendingUserOtherDetailsById(data,id,callback)
{
	var query = "UPDATE pending_"+user_other_details_table+" SET hobbies = ? AND fav_past_time = ? AND mobile_no = ? AND bank_name = ? AND bank_accno = ? WHERE id = ?";
	var params = [];
	params.push(data['hobbies']);
	params.push(data['fav_past_time']);
	params.push(data['mobile_no']);
	params.push(data['bank_name']);
	params.push(data['bank_accno']);
	params.push(id);
	db.query(query,params,callback);
}

function updatePendingUserPresentAddressById(data,id,callback)
{
	var query = "UPDATE pending_"+user_address_table+ " SET line1 = ? AND line2 = ? AND city = ? AND state = ? AND pincode =? AND country = ? AND contact_no = ? WHERE id = ? AND type = ?";
	var params  = [];
	params.push(data['line1']);
	params.push(data['line2']);
	params.push(data['city']);
	params.push(data['state']);
	params.push(data['pincode']);
	params.push(data['country']);
	params.push(data['contact_no']);
	params.push(id);
	params.push('present');
	db.query(query,params,callback);
}


var editDetailsModel = {
	updateUserDetailsById:updateUserDetailsById,
	updateUserOtherDetailsById:updateUserOtherDetailsById,
	updateUserPresentAddressById:updateUserPresentAddressById,
	updateUserPermanentAddressById:updateUserPermanentAddressById,
	updateUserCorrespondenceAddressById:updateUserCorrespondenceAddressById,
	updatePendingUserDetailsById:updatePendingUserDetailsById,
	updatePendingUserOtherDetailsById:updatePendingUserOtherDetailsById,
	updatePendingUserPresentAddressById:updatePendingUserPresentAddressById
};


module.exports = editDetailsModel; 