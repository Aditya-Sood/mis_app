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
var subject_mapping_des_table = db_tables.get('subject_mapping_des_table');
var absent_table = db_tables.get('absent_table');
var total_class_table = db_tables.get('total_class_table');


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

function getSubjectList(data,callback)
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
    		console.log(result);
    		var subject_list = [];
    		var course_id = result[0]['course_id'];
    		var branch_id = result[0]['branch_id'];
    		var sem_form_id = result[0]['sem_form_id'];
    		var query1 = "SELECT DISTINCT map_id FROM "+subject_mapping_table+" WHERE course_id = ? AND branch_id = ? AND semester = ? AND session = ? AND session_year = ?";
    		params1 = [];
    		params1.push(course_id);
    		params1.push(branch_id);
    		params1.push(semester);
    		params1.push(session);
    		params1.push(session_year);
    		db.query(query1,params1,function(err1,result1){
    			if(err1) callback(err,result1);
    			else{
    				console.log(result1);
    				var map_id = result1[0]['map_id'];
    				var query2 = "SELECT subject_id, name ,id FROM "+subjects_table+" WHERE id IN (SELECT DISTINCT sub_id as subject_id FROM "+subject_mapping_des_table+" WHERE map_id = ?)";	
    				params2 = [];
    				params2.push(map_id);
    				db.query(query2,params2,function(err2,result2){
    					for(i=0;i<result2.length;i++)
    					{
    						subject_list.push(result2[i]);
    					}
    					var query3 = "SELECT sub_id FROM "+reg_regular_elective_opted_table+" WHERE form_id = ?";
    					params3 = [];
    					params3.push(sem_form_id);
    					db.query(query3,params3,function(err3,result3){
    						if(err3) callback(err3,callback);
    						else{
    							console.log(result3);
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
	    										console.log(result4[0]);
	    										subject_list.push(result4[0]);
	    										callback();
	    									}
	    								});
	    							});
	    						});
	    						console.log(async_tasks);
	    						async.parallel(async_tasks, function(err,result){
								  // All tasks are done now
								  callback(err,subject_list);
								});
    						}
    					});
    				});
    			}
    		});
    	}
    });
}




function getAttendanceDetails(data,callback)
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
    		console.log(result);
    		var subject_list = [];
    		var course_id = result[0]['course_id'];
    		var branch_id = result[0]['branch_id'];
    		var sem_form_id = result[0]['sem_form_id'];
    		var query1 = "SELECT DISTINCT map_id FROM "+subject_mapping_table+" WHERE course_id = ? AND branch_id = ? AND semester = ? AND session = ? AND session_year = ?";
    		params1 = [];
    		params1.push(course_id);
    		params1.push(branch_id);
    		params1.push(semester);
    		params1.push(session);
    		params1.push(session_year);
    		db.query(query1,params1,function(err1,result1){
    			if(err1) callback(err,result1);
    			else{
    				console.log(result1);
    				var map_id = result1[0]['map_id'];
    				var query2 = "SELECT subject_id, name ,id FROM "+subjects_table+" WHERE id IN (SELECT DISTINCT sub_id as subject_id FROM "+subject_mapping_des_table+" WHERE map_id = ?)";	
    				params2 = [];
    				params2.push(map_id);
    				db.query(query2,params2,function(err2,result2){
    					if(err2) callback(err2,result2);
    					else{
	    					var query3 = "SELECT sub_id FROM "+reg_regular_elective_opted_table+" WHERE form_id = ?";
	    					params3 = [];
	    					params3.push(sem_form_id);
	    					db.query(query3,params3,function(err3,result3){
	    						if(err3) callback(err3,callback);
	    						else{
	    							console.log(result3);
		    						var items = [];
		    						var async_tasks = [];
		    						for(var i=0;i<result2.length;i++)
		    						{
		    							items.push({'sub_id':result2[i]['id']});
		    						}
		    						for(var i=0;i<result3.length;i++)
		    						{
		    							items.push(result3[i]);
		    						}
		    						console.log(items);
		    						items.forEach(function(item){
		    							async_tasks.push(function(callback){
		    								var query4 = "SELECT subject_id, name ,id FROM "+subjects_table+" WHERE id  = ?";
		    								params4 = [];
		    								params4.push(item['sub_id']);
		    								db.query(query4,params4,function(err4,result4){
		    									if(err4) callback(err4,result4);
		    									else{
		    										var att_details = result4[0];
		    										var query5 = "SELECT DISTINCT date FROM "+absent_table+" WHERE sub_id  = ? AND admn_no = ? AND map_id = ?";
		    										var params5 = [];
		    										params5.push(item['sub_id']);
		    										params5.push(adm_no);
		    										params5.push(map_id);
		    										db.query(query5,params5,function(err5,result5){
		    											if(err5) callback(err5,result5);
		    											else
		    											{
		    												att_details['total_absent'] = result5.length;
		    												var query6 = "SELECT total_class FROM "+total_class_table+" WHERE map_id = ? AND sub_id = ?";
		    												var param6 = [];
		    												param6.push(map_id);
		    												param6.push(item['sub_id']);
		    												db.query(query6,param6,function(err6,result6){
		    													if(err6) callback(err6,result6);
		    													else
		    													{
		    														if(result6.length > 0)
		    														att_details['total_class'] = result6[0]['total_class'];
		    														else
		    														att_details['total_class'] = 'class not started';

		    														subject_list.push(att_details);
		    														callback();
		    													}
		    												});
		    											}
		    										});
		    										
		    									}
		    								});
		    							});
		    						});
		    						async.parallel(async_tasks, function(err,result){
									  // All tasks are done now
									  callback(err,subject_list);
									});
	    						}
	    					});
    					}
    				});
    			}
    		});
    	}
    });	
}

var attendance = {
	getSessionYear : getSessionYear,
	getSemester : getSemester,
	getSubjectList : getSubjectList,
	getAttendanceDetails :  getAttendanceDetails
};

module.exports = attendance;