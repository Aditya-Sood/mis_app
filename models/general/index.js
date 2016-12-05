/*
*@author rajatbajaj
*/

//providing the general apis

var db_tables = require('helper/db_tables');

var department_table = db_tables.get('department_table');
var course_table = db_tables.get('course_table');
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
	}

}

module.exports = api;