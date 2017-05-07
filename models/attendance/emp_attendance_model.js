/*
*@author rajatbajaj
*/

var db = require('config/db');
var db_tables = require('helper/db_tables');
var async = require('async');

var session_track_table = db_tables.get('session_track_table');
var total_class_table = db_tables.get('total_class_table');
var class_engaged_table = db_tables.get('class_engaged_table');
var subject_mapping_des_table = db_tables.get('subject_mapping_des_table');
var subject_mapping_table = db_tables.get('subject_mapping_table');
var subjects_table = db_tables.get('subject_table');
var user_details_table = db_tables.get('user_details_table');
var honour_minor_table = db_tables.get('honour_minor_table');
var honour_minor_details_table = db_tables.get('honour_minor_details_table');
var reg_regular_form_table = db_tables.get('reg_regular_form_table');
var student_section_data_table = db_tables.get('student_section_data_table');
var reg_other_subjects_table = db_tables.get('reg_other_subjects_table');
var reg_other_form_table = db_tables.get('reg_other_form_table');
var user_details_table = db_tables.get('user_details_table');
var absent_table = db_tables.get('absent_table');
var attendance_remark_table = db_tables.get('attendance_remark_table');


function getSubjectsMappedToEmployee(data,callback)
{
	var session_year = data['session_year'];
	var session = data['session'];
	var emp_id = data['emp_id'];
	
	var query = "SELECT S.subject_id as s_id, S.name as sub_name, newt.sub_id,newt.semester,newt.group,newt.branch_name,newt.course_name,newt.branch_id,newt.course_id,newt.aggr_id FROM (SELECT session,session_year,sub_id, B.branch_id,B.course_id,B.group, semester, emp_no, A.map_id,branches.name as branch_name,courses.name as course_name,B.aggr_id FROM subject_mapping_des AS A INNER JOIN subject_mapping AS B ON A.map_id = B.map_id LEFT JOIN branches ON B.branch_id=branches.id LEFT JOIN courses ON B.course_id=courses.id ) AS newt INNER JOIN subjects AS S ON S.id = newt.sub_id WHERE newt.emp_no = ? AND session = ? AND session_year= ? AND newt.group='0'";
	
	var params = [];
	params.push(emp_id);
	params.push(session);
	params.push(session_year);

	if(data['crs_type'] != null)
	{
		var crs_type = data['crs_type'];
		query = query + " AND newt.course_id = ?";
		params.push(data['crs_type']);
	}
	
	db.query(query,params,callback);
}

function getSessionId(data,callback){
	var query = "SELECT session_id FROM "+session_track_table+" WHERE session = ? AND session_year = ? AND semester = ? AND branch_id = ? AND course_id = ?";
	var params = [];
	params.push(data['session']);
	params.push(data['session_year']);
	params.push(data['semester']);
	params.push(data['branch_id']);
	params.push(data['course_id']);
	db.query(query,params,callback);
}

function getTotalClasses(map_id,sub_id,session_id,callback)
{
	var query = "SELECT total_class FROM "+total_class_table+ " WHERE map_id = ? AND sub_id = ? AND session_id = ?";
	var params = [];
	params.push(map_id);
	params.push(sub_id);
	params.push(session_id);
	db.query(query,params,callback);
}

function getLastSubmissionDate(map_id,sub_id,session_id,callback)
{
	var query = "SELECT date FROM "+class_engaged_table + " WHERE map_id = ? AND sub_id = ? AND session_id = ? ORDER BY date DESC";
	var params = [];
	params.push(map_id);
	params.push(sub_id);
	params.push(session_id);
	db.query(query,params,callback);
}


function getSubjectsMappedToEmployeeWithDetails(data,callback1)
{
	var session_year = data['session_year'];
	var session = data['session'];
	var emp_id = data['emp_id'];

	var query = "SELECT subject_mapping.map_id as map_id,subject_mapping.semester as semester,subjects.name as sub_name ,subjects.id as sub_id,subject_mapping.branch_id as branch_id ,subject_mapping.group,subject_mapping.section,cs_branches.name as branch_name, subject_mapping.course_id as course_id,subject_mapping.aggr_id,cs_courses.name as course_name,subject_mapping_des.coordinator as coordinator,subjects.type as sub_type FROM subject_mapping INNER JOIN subject_mapping_des ON subject_mapping_des.map_id = subject_mapping.map_id INNER JOIN subjects ON subjects.id = subject_mapping_des.sub_id INNER JOIN cs_branches ON subject_mapping.branch_id=cs_branches.id INNER JOIN cs_courses ON subject_mapping.course_id=cs_courses.id WHERE session_year=? and session=? and emp_no=?";
	var params = [];
	params.push(session_year);
	params.push(session);
	params.push(emp_id);
	var final_result = [];
	db.query(query,params,function(err,result){
		if(err) callback(err,result);
		else{
			var async_tasks = [];
			result.forEach(function(item){
				async_tasks.push(function(callback){
					var serial_tasks = [];
					var session_id ,total_classes ,last_submission_date;
					serial_tasks.push(function(callbck){
						getSessionId(item,function(err,result){
							if(err) callbck(err,result);
							else{
								if(result.length == 0)
								{
									callbck(true,{'success':false,'message':'session_id not found'});
								}
								else{
									session_id = result[0];
									callbck();		
								}
							}
						});
					});

					serial_tasks.push(function(callbck){
						getTotalClasses(item['map_id'],item['sub_id'],session_id,function(err,result){
							if(err) callbck(err,result);
							else{
								if(result.length == 0)
								{
									callbck(true,{'success':false,'message':'error in getting total number of classes'});
								}
								else{
									total_classes = result[0];
									callbck();
								}
							}
						});
					});

					serial_tasks.push(function(callbck){
						getLastSubmissionDate(item['map_id'],item['sub_id'],session_id,function(err,result){
							if(err) callbck(err,result);
							else{
								if(result.length == 0)
								{
									callbck(true,{'success':false,'message':'error in getting last submission date'});
								}
								else{
									last_submission_date = result[0];
									callbck();
								}
							}
						});
					});

					async.series(serial_tasks,function(err,result){
						if(err) callback(err,result);
						else{
							item['session_id'] = session_id;
							item['total_classes'] = total_classes;
							item['last_submission_date'] = last_submission_date;
							final_result.push(item);
						}
					});
				});
			});

			async.parallel(async_tasks,function(err,result){
				if(err) callback1(err,result);
				else{
					callback1(err,{'subject_details':final_result});
				}
			});
		}
	});
}

function getClass(data,callback)
{
	var query = "SELECT map_id FROM "+subject_mapping_des_table+ " WHERE sub_id = ?";
	var params = [];
	params.push(data['sub_id']);
	db.query(query,params,function(err,result){
		if(err) callback(err,result);
		else{
			var query = "SELECT semester,course_id,branch_id FROM "+subject_mapping_table+" WHERE map_id = ?";
			var params = [];
			params.push(result[0]['map_id']);
			db.query(query,params,callback);
		}
	});
}

function getRecord(data,callback)
{
	var admn_no = data['admn_no'];
	var map_id = data['map_id'];
	var sub_id = data['sub_id'];
	var session_id = data['session_id'];
	var date = data['date'];
	var query = "SELECT * FROM "+absent_table+" WHERE admn_no = ? AND map_id = ? AND sub_id = ? AND date = ? AND session_id = ?";
	var params = [];
	params.push(admn_no);
	params.push(map_id);
	params.push(sub_id);
	params.push(date);
	params.push(session_id);
	db.query(query,params,callback);
}

function checkAbsentTable(data,callback)
{
	var admn_no = data['admn_no'];
	var map_id = data['map_id'];
	var sub_id = data['sub_id'];
	var session_id = data['session_id'];
	var date = data['date'];
	var query = "SELECT Remark FROM "+absent_table + " WHERE admn_no = ? AND map_id = ? AND sub_id = ? AND date = ? AND session_id = ?";
	var params = [];
	params.push(admn_no);
	params.push(map_id);
	params.push(sub_id);
	params.push(date);
	params.push(session_id);
	db.query(query,params,callback);
}

function getCheckStatus(data,callback)
{
	var admn_no = data['admn_no'];
	var map_id = data['map_id'];
	var sub_id = data['sub_id'];
	var session_id = data['session_id'];
	var query = "SELECT status FROM "+absent_table+" WHERE admn_no = ? AND map_id = ? AND sub_id = ? AND session_id = ?";
	var params =  [];
	params.push(admn_no);
	params.push(map_id);
	params.push(sub_id);
	params.push(session_id);
	db.query(query,params,callback);
}

function getRecordFromAttendanceRemarkTable(data,callback)
{
	var query = "SELECT count,Remark FROM "+attendance_remark_table+ " WHERE admn_no = ? AND sub_id = ? AND session_id = ?";
	var params = [];
	params.push(admn_no);
	params.push(sub_id);
	params.push(session_id);
	db.query(query,params,callback);
}


function getDateOfClass(data,callback)
{
	var session_id =  data['session_id'];
	var map_id = data['map_id'];
	var sub_id = data['sub_id'];
	var query = "SELECT date FROM "+class_engaged_table+" WHERE session_id = ? AND sub_id = ? AND map_id = ?";
	var params = [];
	params.push(session_id);
	params.push(sub_id);
	params.push(map_id);
	db.query(query,params,callback);
}

function getMapId(data,callback)
{
	var sub_id = data['sub_id'];
	var emp_id = data['emp_id'];
	var query = "SELECT map_id FROM "+subject_mapping_des_table + " WHERE sub_id = ? AND emp_no = ?";
	var params = [];
	params.push(sub_id);
	params.push(emp_id);
	db.query(query,params,callback);
}

function getSubjectId(id,course_id,branch_id,callback)
{	
	console.log(subjects_table);
	var query = "SELECT subject_id FROM "+subjects_table+" WHERE id = ?";
	var params = [];params.push(id);
	db.query(query,params,function(err,result){
		if(err) callback(err,result);
		else{
			var query = "select * from subject_mapping_des as a join subjects as b on a.sub_id=b.id join subject_mapping as c on a.map_id=c.map_id where b.subject_id=? and c.course_id=? and c.branch_id=?";
			var params = [];
			params.push(result[0]['subject_id']);
			params.push(course_id);
			params.push(branch_id);
			db.query(query,params,callback);
		}
	});
}



function getStudent(data,callback)
{
	var sub_id = data['sub_id'];
	var session = data['session'];
	var sub_table;
	if(session == "Summer")
	{
		sub_table = "reg_summer_subject";
	}
	else{
		sub_table = "reg_regular_elective_opted";
	}

	getSubjectId(sub_id,data['course_id'],data['branch_id'],function(err,result){
		if(err) callback(err,result);
		else
		{
			if(result.length == 0)
			{
				callback({'message':'unable to get subject id in getStudent'},result);
			}
			else{
				console.log(subjects_table);
				var query = "SELECT form_id FROM "+sub_table+" WHERE ";
				for(var i =0;i<result.length;i++)
				{
					if(i == 0)
					{
						query = query + 'sub_id = '+"'"+result[i]['id']+"'";
					}
					else{
						query = query + ' OR sub_id = '+"'"+result[i]['id']+"'";
					}
				}
				console.log(query);
				var params = [];
				db.query(query,params,function(err,result){
					if(err) callback(err,result);
					else{
						data['form_no'] = result;
						if(data['form_no'].length < 5)
						{
							data['form_no'] = [];
						}
						getAdmissionNumber(data,callback);
					}
				});
			}
		}

	});
}


function getStudentMinor(data,callback)
{
	var sub_id = data['sub_id'];
	var session = data['session'];
	var query = "SELECT admn_no FROM " + honour_minor_table + "AS h1 JOIN "+honour_minor_details_table+ " AS h2 WHERE h1.form_id = h2.form_id AND h1.minor = 1 AND h1.session_year = ? AND h1.minor_hod_status = 'Y' AND h2.dept_id = ? AND h2.branch_id = ? AND h2.offered = '1'";
	var params = [];
	params.push(data['session_year']);
	params.push(data['dept_id']);
	params.push(data['branch_id']);
	db.query(query,params,function(err,result){
		if(err) callback(err,result);
		else{
			data['stu_admn'] = result;
			getName(data,callback);
		}
	});
}

function getStudentHonour(data,callback)
{
	var query = "SELECT admn_no FROM "+honour_minor_table +" WHERE honours = '1' AND session_year = ? AND honours_hod_status = 'Y' AND dept_id = ?";
	var params = [];
	params.push(data['session_year']);
	params.push(data['dept_id']);
	params.push(data['branch_id']);

	db.query(query,params,function(err,result)
	{
		if(err) callback(err,result);
		else{
			data['stu_admn'] = result;
			getName(data,callback);
		}
	});
}

function getStudentComm(data,callback)
{
	var query = "SELECT admn_no FROM "+reg_regular_form_table + " AS t1 JOIN "+student_section_data_table+" AS t2 WHERE t1.admn_no = t2.admn_no AND t1.hod_status = '1' AND t1.acad_status = '1' AND t1.session_year = ? AND t1.session = ? AND t1.semester=? AND t2.section = ?";
	var params = [];
	params.push(data['session_year']);
	params.push(data['session']);
	params.push(data['semester']);
	params.push(data['section']);
	db.query(query,params,function(err,result)
	{
		if(err) callback(err,result);
		else{
			data['stu_admn'] = result;
			getName(data,callback);
		}
	});	
}

function getAdmissionNumber(data,callback)
{
	var session_year = data['session_year'];
	var session = data['session'];
	var branch_id = data['branch_id'];
	var semester = data['semester'];
	var course_id = data['course_id'];
	var temp_arr = [];
	console.log('_________________data["form_no"]');
	for(var i=0;i<data['form_no'].length ;i++)
	{
		temp_arr.push(data[form_no][i]['form_id']);
	}

	if(data['form_no'].length > 0)
	{
		var form_table = 'reg_regular_form';
		if(session == "Summer")
		{
			form_table = 'reg_summer_form';
		}	
		var query = "SELECT admn_no FROM reg_regular_form WHERE session_year = ? AND session = ? AND branch_id = ? AND course_id = ? AND semester = ? AND hod_status = '1' AND acad_status = '1' AND form_id IN (?)";
		var params = [];
		params.push(session_year);
		params.push(session);
		params.push(branch_id);
		params.push(course_id);
		params.push(semester);
		params.push(temp_arr);
		db.query(query,params,function(err,result){
			if(err) callback(err,result);
			else{
				data['stu_admn'] = result;
				callback(err,result);
			}
		});
	}
	else{
		var query = "SELECT admn_no FROM reg_regular_form WHERE session_year = ? AND session = ? AND branch_id = ? AND course_id = ? AND semester = ? AND hod_status = '1' AND acad_status = '1' ";
		var params = [];
		params.push(session_year);
		params.push(session);
		params.push(branch_id);
		params.push(course_id);
		params.push(semester);
		db.query(query,params,function(err,result){
			if(err) callback(err,result);
			else{
				data['stu_admn'] = result;
				getName(data,function(err,result){
					if(err) callback(err,result);
					else{
						callback(err,result);
					}
				});
			}
		});
	}
}

function getName(data,callback)
{
	var temp  = [];
	for(var i = 0;i<data['stu_admn'].length;i++)
	{
		temp.push(data["stu_admn"][i]["admn_no"]);
	}
	if(data['stu_admn'].length > 0)
	{
		var query = "SELECT id,first_name,middle_name,last_name FROM "+user_details_table+" WHERE id in (?) ORDER BY id ASC";
		var params = [];
		params.push(temp);
		db.query(query,params,callback);
	}
}

function getRepStudents(data,callback)
{
	var sub_id = data['sub_id'];
	var query = "SELECT form_id FROM "+reg_other_subjects_table+ " WHERE sub_id = ?";
	var params  = [];
	params.push(sub_id);
	db.query(query,params,function(err,result){
		if(err) callback(err,result);
		else{
			data['rep_form_no'] = result;
			if(data['rep_form_no'].length != 0)
			{
				getRepAdmn(data,callback);
			}
			else{
				//pending what to return
				callback(err,result);
			}
		}
	});
}

function getRepAdmn(data,callback)
{
	var session_year = data['session_year'];
	var session = data['session'];
	var branch_id = data['branch_id'];
	var semester = data['semester'];
	var course_id = data['course_id'];
	var temp_arr = [];
	for(var i =0;i<data['rep_form_no'].length;i++)
	{
		temp_arr.push(data['rep_form_no'][i]['form_id']);
	}
	if(data['rep_form_no'].length > 0)
	{
		var query = "SELECT admn_no FROM "+reg_other_form_table+" WHERE session_year = ? AND session = ? AND branch_id = ? AND course_id = ? AND semester = ? AND form_id in (?) AND reason LIKE 'repeater'";
		var params = [];
		params.push(session_year);
		params.push(session);
		params.push(branch_id);
		params.push(course_id);
		params.push(semester);
		params.push(temp_arr);
		db.query(query,params,function(err,result){
			if(err) callback(err,result);
			else{
				data['stu_rep_admn'] = result;
				if(data['stu_rep_admn'].length != 0)
				{
					getName(data,callback);
				}
				else{
					//pending return thing
					callback(err,result);
				}
			}
		});
	}else{
		callback({'message':'rep form no. not found'},{});
	}
}
	
function viewAttendanceSheet(data,callback)
{
	var session_year = data['session_year'];
	var branch_name  =  data['branch_name'];
	var course_name = data['course_name'];
	var session = data['session'];
	var sub_id = data['sub_id'];
	var branch_id = data['branch_id'];
	var course_id =  data['course_id'];
	var sub_name = data['sub_name'];
	var emp_id = data['emp_id'];
	var group,section;
	if(course_id ==  'comm')
	{
		group = data['group'];
		section = data['section'];
	}

	getClass(data,function(err,result){
		if(err) callback(err,result);
		else{
			if(result.length == 0)
			{
				callback({'message':'zero rows found in getClass function'},{});
			}else{
				data['semester'] = result[0]['semester'];
				data['course_id'] = result[0]['course_id'];
				data['branch_id'] = result[0]['branch_id'];
				var fn ;
				if(data['course_id'] == 'minor')
				{
					fn = getStudentMinor;
				}else if(data['course_id'] == 'honour')
				{
					fn = getStudentHonour;
				}else if(data['course_id'] == 'comm')
				{
					fn = getStudentComm;
				}
				else{
					fn = getStudent;
				}


				var async_tasks = [];
				async_tasks.push(function(callback1){
					fn(data,function(err,result){
						if(err) callback1(err,result);
						else{
							data['stu_name'] = result;
							callback1();
						}
					});
				});

				async_tasks.push(function(callback1){
					getRepStudents(data,function(err,result){
						if(err) callback1(err,result);
						else
						{
							data['rep_name'] = result;	
							callback1();
						}
					});
				});

				async_tasks.push(function(callback1){
					getMapId(data,function(err,result){
						if(err) callback1(err,result);
						else{
							if(result.length == 0) callback1({'message':'unable to get map_id'},{});
							else{
								data['map_id'] = result[0]['map_id'];
								callback1();
							}
						}
					});
				});
				
				async_tasks.push(function(callback1){
					if(err) callback1(err,result);
					else{
						getSessionId(data,function(err,result){
							if(err) callback1(err,result);
							else{
								if(result.length == 0)
								{
									callback1({'message':'unable to get session id'},{});
								}
								else{
									data['session_id'] = result[0]['session_id'];
									callback1();
								}
							}
						});
					}
				});

				async.parallel(async_tasks,function(err,result){
					if(err) callback(err,result);
					else{
						getDateOfClass(data,function(err,result){
							if(err) callback(err,result);
							else{
								data['date_of_class'] = result;
								data['total_number_of_classes'] = result.length;
								var count = 0;
								data['admission'] = {};
								console.log(data['stu_name']);
								var par_tasks = [];
								data['stu_name'].forEach(function(item){
									var index = count;
									count++;
									par_tasks.push(function(callback1)
										{
										data['admission'][index] = {};
										data['admission'][index]['admn_no'] = item['id'];
										data['admission'][index]['name'] = item['name'];
										var query = "SELECT DISTINCT date FROM "+absent_table+" WHERE sub_id  = ? AND admn_no = ? AND map_id = ?"
										var params = [];
										params.push(data['sub_id']);
										params.push(item['id']);
										params.push(data['map_id']);
										db.query(query,params,function(err,result){
											if(err) callback1(err,result);
											else{
												data['admission'][index]['absents'] = result.length;
												callback1(err,data);
											}
										});
									});
								});


								async.parallel(par_tasks,function(err,result){
									if(err) callback(err,result);
									else{
										callback(err,data);
									}
								});

							}
						});
					}
				})
			}
		}
	});
}


function getDefaulterList(data,callback)
{
	viewAttendanceSheet(data,function(err,result){
		if(err) console.log({'err_msg':'error in getting the attendance'},result);
		else{
			var att_details = result;
			var safe_list_index = [];
			var total_number_of_classes = att_details['total_number_of_classes'];
			//console.log(Object.keys(att_details['admission']).length);
			for(var i=0; i<Object.keys(att_details['admission']).length;i++)
			{
				var num_presents = total_number_of_classes - att_details['admission'][i]['absents'];
				var percent_att = (num_presents*100)/total_number_of_classes;
				console.log(i);
				console.log(percent_att);
				if(percent_att >= 75.0)
				{
					safe_list_index.push(i);
				}
			}
			console.log(safe_list_index);
			for(var i=0;i<safe_list_index.length;i++)
			{
				delete att_details['stu_name'][safe_list_index[i]];
				delete att_details['admission'][safe_list_index[i]];
			}
			//console.log(att_details);
			callback(err,att_details);
		}
	});
}

function getSubjectsCommon(data,callback){
	var query = "SELECT S.subject_id as s_id, name, newt.sub_id as n_id, newt.semester FROM (SELECT session,session_year,sub_id, B.course_id, semester, emp_no, A.map_id FROM subject_mapping_des AS A INNER JOIN subject_mapping AS B ON A.map_id = B.map_id) AS newt INNER JOIN subjects AS S ON S.id = newt.sub_id WHERE newt.emp_no = ? AND session=? and newt.course_id='comm' AND session_year=? AND (semester='1' OR semester='2')"
	params = [];
	params.push(data['emp_id']);
	params.push(data['session']);
	params.push(data['session_year']);
	db.query(query,params,callback);
}

function getSectionCommon(data,callback){
	getMapId(data,function(err,result){
		if(err) callback(err,result)
		else{
			console.log(result);
			var map_id = result[0]['map_id'];
			var query = "SELECT section FROM subject_mapping WHERE map_id = ?";
			var params = [];
			params.push(map_id);
			db.query(query,params,callback);
		}
	});
}

var empAttendanceModel = {
	getSubjectsMappedToEmployee : getSubjectsMappedToEmployee,
	getDefaulterList : getDefaulterList,	
	viewAttendanceSheet : viewAttendanceSheet,
	getSubjectsCommon : getSubjectsCommon,
	getSectionCommon : getSectionCommon
};

module.exports = empAttendanceModel;