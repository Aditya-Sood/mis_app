/*
*@author rajatbajaj
*/

var db = require('config/db');
var db_tables = require('helper/db_tables');
var async = require('async');

var reg_regular_form_table = db_tables.get('reg_regular_form_table');
var subjects_table = db_tables.get('subject_table');
var reg_regular_elective_opted_table = db_tables.get('reg_regular_elective_opted_table');
var subject_mapping_table = db_tables.get('subject_mapping_table');
var subject_mapping_des_table = db_tables.get('subject_mapping_des');

function getSessionYear(adm_no,callback)
{
	var query = "SELECT DISTINCT session_year FROM "+ reg_regular_form_table + " AS reg WHERE reg.admn_no = ?";

	var params = [];
	params.push(adm_no);
	db.query(query,params,callback);
}

function getSemester(adm_no,session_year,session,callback)
{
	var query = "SELECT DISTINCT semester as semster FROM "+reg_regular_form_table+" WHERE session = ? AND session_year = ? AND admn_no = ?";
	params = [];
	params.push(session);
	params.push(session_year);
	params.push(adm_no);
	db.query(query,params,callback);
}

function getSubjects(adm_no,session,session_year,callback)
{
	var query = "SELECT DISTINCT form_id as sem_form_id FROM "+reg_regular_form_table+" WHERE session =? AND session_year =? AND admn_no = ?";
	params = [];
	params.push(session);
	params.push(session_year);
	params.push(adm_no);
	db.query(query,params,function(err,result){
		if(err) callback(err,result);
		else{
			var qury = "SELECT subject_id, name FROM "+subjects_table+" WHERE id IN (SELECT sub_id FROM "+reg_regular_elective_opted_table+" AS reg WHERE stu_sem_reg_subject.form_id = ?)";

		}
	});
}

function getAttendenceDetails(data)
{
	var session_year = data['session_year'];
	var session = data['session'];
	var adm_no = data['adm_no'];
	var semester = data['semester'];
	var query = "SELECT DISTINCT course_id, branch_id,form_id as sem_form_id FROM "+reg_regular_form_table+" WHERE admn_no = ? AND session_year = ? AND session = ?";
    params = [];
    params.push(adm_no);
    params.push(session_year);
    params.push(session);
    db.query(query,params,function(err,result){
    	if(err) callback(err,result);
    	else
    	{
    		var subject_list[];
    		var course_id = result[0]['course_id'];
    		var branch_id = result[0]['branch_id'];
    		var sem_form_id = result[0]['sem_form_id'];
    		var query1 = "SELECT DISTINCT map_id FROM "+subject_mapping_table+" WHERE course_id = course_id AND branch_id = branch_id AND semester = ? AND session = ? AND session_year = ?";
    		params1 = [];
    		params1.push(semester);
    		params1.push(session);
    		params1.push(session_year);
    		db.query(query1,params1,function(err1,result1){
    			if(err1) callback(err,result1);
    			else{
    				var map_id = result1[0]['map_id'];
    				var query2 = "SELECT subject_id, name ,id FROM "+subjects_table+" WHERE id IN (SELECT DISTINCT sub_id as subject_id FROM "+subject_mapping_des_table+" WHERE map_id = ?)";	
    				params2 = [];
    				params2.push(map_id);
    				db.query(query2,params2,function(err2,result2){
    					var query3 = "SELECT sub_id FROM "+reg_regular_elective_opted_table+" WHERE form_id = ?";
    					params3 = [];
    					params3.push(sem_form_id);
    					db.query(query3,params3,function(err3,result3){
    						if(err3) callback(err3,callback);
    						else{
	    						var items = [];
	    						var async_tasks = [];
	    						for(var i=0;i<result3.length;i++)
	    						{
	    							items.push(result3[i]);
	    						}
	    						items.forEach(function(item){
	    							async_tasks.push(function(callback){
	    								var query4 = "SELECT subject_id, name ,id FROM "+subjects_table+" WHERE id  = ?";
	    								params4 = [];
	    								params4.push(item['sub_id']);
	    								db.query(query4,params4,function(err4,result4){
	    									if(err4) callback(err4,result4);
	    									else{
	    										subject_list.push(result4[0]);
	    									}
	    								});
	    							});
	    						});
	    						async.parallel(async_tasks, function(){
								  // All tasks are done now
								  console.log(subject_list);
								});
    						}
    					});
    				});


    			}
    		});
    	}
    });
	db.query(query,)
}

var attendance = {
	getSessionYear : getSessionYear,
	getSemester : getSemester,
};

module.exports = attendance;