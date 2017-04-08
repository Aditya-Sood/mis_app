/*
*@author rajatbajaj
*/

//providing the general apis

var db_tables = require('helper/db_tables');

var department_table = db_tables.get('department_table');
var course_table = db_tables.get('course_table');
var branch_table = db_tables.get('branch_table');

var stu_academic_table = db_tables.get('student_academic_details_table');
var user_login_attempts_table = db_tables.get('user_login_attempts_table');

var db = require('config/db');

var api = {

	getDepartmentNameById : function(dept_id,callback){
		var query = "SELECT * FROM "+department_table+" WHERE id = ?";
		var params = [];
		params.push(dept_id);

		db.query(query,params,function(err,result){
			if(err)
			{
				callback(err,{});
			}
			else
			{
				console.log(result);
				callback(err,result[0]);
			}
		});
	},

	getCourseNameById : function(course_id,callback)
	{
		var query = "SELECT * FROM "+course_table+" WHERE id = ?";
		var params = [];
		params.push(course_id);

		db.query(query,params,function(err,result){
			if(err)
			{
				callback(err,{});
			}
			else
			{
				console.log(result);
				callback(err,result[0]);
			}
		});	
	},

	getBranchNameById : function(branch_id,callback)
	{
		var query = "SELECT * FROM "+branch_table+" WHERE id = ?";
		var params = [];
		params.push(branch_id);

		db.query(query,params,function(err,result){
			if(err)
			{
				callback(err,{});
			}
			else
			{
				console.log(result);
				callback(err,result[0]);
			}
		});	
	},

	getLastLoginDate :function(user_id,callback){
		var query = "SELECT time FROM "+user_login_attempts_table+" where id = ? order by `time` desc limit 1,1";
		var params = [];
		params.push(user_id);
		db.query(query,params,callback);
	},

	getGeneralStuData :function(user_id,callback){
		var query="SELECT course_id,semester from "+stu_academic_table+" where admn_no=?";
		var params = [];params.push(user_id)	
		db.query(query,params,callback);
	}

}

module.exports = api;