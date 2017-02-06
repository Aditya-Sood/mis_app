/*
*@author rajatbajaj
*/

/*
*This file contains all the functions to get
*the basic informations from the database
*for this module
*/

var db = require('config/db');
var db_tables = require('helper/db_tables');
var async = require('async');

var user_details_tables = db_tables.get('user_details_table');
var dept_course_table = db_tables.get('dept_course_table');
var course_table = db_tables.get('course_table');
var department_table = db_tables.get('department_table');
var branch_table = db_tables.get('branch_table');
var subject_table = db_tables.get('subject_table');
var course_structure_table  = db_tables.get('course_structure_table');
var elective_group_table = db_tables.get('elective_group_table');
var course_branch_table = db_tables.get('course_branch_table');
var optional_offered_table = db_tables.get('optional_offered_table');
var honour_minor_offered_table = db_tables.get('honour_minor_offered_table');
var minor_offered_table = db_tables.get('minor_offered_table');
var syllabus_table = db_tables.get('syllabus_table');


function getAllFromDeptId(dept_id,callback)
{
	var query,params = [];
	if(dept_id == 'comm')
	{
		query = "SELECT DISTINCT 'cse' as id,departments.name as dept_name,duration,course_branch.course_id,course_branch.branch_id,cs_branches.name as branch_name,SUBSTRING(course_structure.aggr_id,Length(course_structure.aggr_id)-8,4) as start,SUBSTRING(course_structure.aggr_id,Length(course_structure.aggr_id)-3,4) as end,cs_courses.name as course_name FROM course_structure,departments,course_branch,cs_branches,cs_courses,dept_course where course_structure.aggr_id=dept_course.aggr_id and departments.id IN (?,'cse') and cs_courses.id=course_branch.course_id and dept_course.course_branch_id=course_branch.course_branch_id and dept_course.dept_id IN (?,'cse') and cs_branches.id=course_branch.branch_id  and course_branch.course_id='comm' GROUP BY course_branch.course_id,course_branch.branch_id,start DESC";
		params.push(dept_id);
		params.push(dept_id);
	}
	else{
		query = "SELECT DISTINCT departments.id,departments.name as dept_name,duration,course_branch.course_id,course_branch.branch_id,cs_branches.name as branch_name,SUBSTRING(course_structure.aggr_id,Length(course_structure.aggr_id)-8,4) as start,SUBSTRING(course_structure.aggr_id,Length(course_structure.aggr_id)-3,4) as end,cs_courses.name as course_name FROM course_structure,departments,course_branch,cs_branches,cs_courses,dept_course where course_structure.aggr_id=dept_course.aggr_id and departments.id=? and cs_courses.id=course_branch.course_id and dept_course.course_branch_id=course_branch.course_branch_id and dept_course.dept_id=? and course_id NOT IN ('comm')and cs_branches.id=course_branch.branch_id GROUP BY course_branch.course_id,course_branch.branch_id,start DESC";
		params.push(dept_id);
		params.push(dept_id);
	}
	db.query(query,params,callback);
}

function viewCourseStructure(data,callback1)
{
	var course = {};
	var dept_id = data['dept_id'];
	var course_id = data['course'];
	var branch_id =  data['branch_id'];
	var semester = data['semester'];
	var session = data['session'];
	var group,aggr_id,expected_aggr_id,course_branch_id;
	if(dept_id ==  'comm')
	{
		group = data['group'];
		course_id = branch_id = "comm";
	}

	var async_tasks = [];
	async_tasks.push(function(callback){
		expected_aggr_id = course_id+'_'+branch_id+'_'+session;
		if(!checkIfAggrIdExist(expected_aggr_id))
		{
			getLatestAggrId(course_id,branch_id,expected_aggr_id,function(err,result){
				if(err){
					callback1(err,result);
				}
				else{
					if(result.length != 0)
					{
						aggr_id = result[0]['aggr_id'];
					} 
					else
					{
						aggr_id = '__';
					}
				}
				callback();
			});
		}
		else
		{
			aggr_id = expected_aggr_id;
			callback();
		}
	});


	async_tasks.push(function(callback){
		selectCourseBranch(course_id,branch_id,function(err,result){
			if(err) callback1(err,result);
			else{
				course_branch_id = result[0]['course_branch_id'];
				callback();
			}
		});
	});

	var syllabus_path;
	
	async.parallel(async_tasks,function(err,result){
		var par_tasks = [];

		data['aggr_id'] = aggr_id;
		data['course_branch_id'] = course_branch_id;
		par_tasks.push(function(callback){
			checkIfSyllabusExist(aggr_id,course_branch_id,function(err,result){
				if(err)
				{
					console.log("Syllabus does not exist");
					callback1(err,result);
				}
				else
				{
					console.log("Syllabus exist -> "+result);
					if(result.length == 0)
					{
						callback(null,{'err':'syllabus_path not found'});
					}
					else
					{
						data['syllabus_path'] = result[0]['syllabus_path'];
						console.log('syllabus_path');
						callback();
					}
				}
			});
		});

		par_tasks.push(function(callback){
			getBranchDetailsById(function(err,result){
				if(err) callback(err,result);
				else
				{
					data['branch_name'] = result[0]['name'];
					callback();
				}
			},branch_id);
		});

		par_tasks.push(function(callback){
			getCourseDetailsById(function(err,result){
				if(err) callback(err,result);
				else
				{
					data['course_name'] =  result[0]['name'];
					data['course_duration'] =  result[0]['duration'];
					callback();
				}
			},course_id);
		});

		async.parallel(par_tasks,function(err,result){
			if(err) callback1(err,result);
			else{
				var start_sem,end_sem;
				if(course_id == "honour" || course_id == "minor")
				{
					if(semester == '*')
					{
						start_sem = 5;
						end_sem = 8;
					}
					else
					{
						start_sem = end_sem = semester;
					}
				}
				else if(course_id == "prep"){
					if(semester == "*")
					{
						start_sem = -1;
						end_sem = 0;
					}
					else{
						start_sem = end_sem = semester;
					}
				}
				else if(course_id == "b.tech" || course_id == "dualdegree")
				{
					if(semester == "*")
					{
						start_sem = 3;
						end_sem = 2*data['course_duration'];
					}
					else
					{
						start_sem = end_sem = semester;
					}
				}else{
					if(semester == "*")
					{
						start_sem = 1;
						end_sem = 2*data['course_duration'];
					}
					else{
						start_sem = end_sem = semester;
					}
				}

				data['start_sem'] = start_sem;
				data['end_sem'] = end_sem;
				course['cs_session'] =  data;
				course['flag'] =  1;
				course['subjects'] = {};
				
				var tasks = [];
				var sem_list = [];
				course['subjects']['group_details'] = {};
				course['subjects']['subject_details'] = {};
				course['subjects']['sequence_no'] = {};
				course['subjects']['elective_count'] = {};
				course['subjects']['count'] = {};

				for(var sem = start_sem ; sem<=end_sem ; sem++)
				{	
					sem_list.push(sem);
				}	
				sem_list.forEach(function(sem){

					if(course['cs_session']['dept_id'] == "comm"){
						tasks.push(function(callback){
							var counter = sem + '_' + data['group'];
							getCourseDetails(counter,sem,aggr_id,0,function(err,result){
								if(err) callback(err,result);
								else{
									console.log(result);
									course['subjects']['group_details'][counter] = result['group_details'];
									course['subjects']['subject_details'][counter] = result['subject_details'][counter];
									course['subjects']['sequence_no'][counter] = result['sequence_no'][counter];
									course['subjects']['count'][counter] = result['count'][counter];
									course['subjects']['elective_count'][counter] = result['elective_count'];
									callback();
								}
							});
						});
					}
					else
					{
						if((sem == 1 || sem == 2) && ((data['course_duration'] == 1 && course_id == 'comm')||data['course_duration'] == 5))
						{	
							var async_tasks = [];
							var comm_group_list = [];

							for(var comm_group = 1;comm_group <= 2;comm_group++)
							{
								comm_group_list.push(comm_group);
							}
							comm_group_list.forEach(function(comm_group){
								tasks.push(function(callback){
									var counter = sem + '_' + comm_group;
									getCourseDetails(counter,sem,aggr_id,0,function(err,result){
										if(err) callback(err,result);
										else{
											console.log(result);												
											course['subjects']['group_details'][counter] = result['group_details'];
											course['subjects']['subject_details'][counter] = result['subject_details'][counter];
											course['subjects']['count'][counter] = result['count'][counter];
											course['subjects']['sequence_no'][counter] = result['sequence_no'][counter];
											course['subjects']['elective_count'][counter] = result['elective_count'];
											callback();
										}
									});
								});	
							});
						}
						else
						{
							if((sem == 5 || sem == 6 || sem == 7 || sem == 8) && data['course_id'] == "honour")
							{
								tasks.push(function(callback){
									var counter = sem;
									getCourseDetails(counter,sem,aggr_id,1,function(err,result){
										if(err) callback(err,result);
										else{
											console.log(result);													
											course['subjects']['group_details'][counter] = result['group_details'];
											course['subjects']['subject_details'][counter] = result['subject_details'][counter];
											course['subjects']['count'][counter] = result['count'][counter];
											course['subjects']['sequence_no'][counter] = result['sequence_no'][counter];
											course['subjects']['elective_count'][counter] = result['elective_count'];
											callback();
										}
									});	
								});
							}
							else if((sem == 5 || sem == 6 || sem == 7 || sem == 8) && data['course_id'] == "minor")
							{
								tasks.push(function(callback){
									var counter = sem;
									getCourseDetails(counter,sem,aggr_id,1,function(err,result){
										if(err) callback(err,result);
										else{
											console.log(result);		
											course['subjects']['group_details'][counter] = result['group_details'];
											course['subjects']['subject_details'][counter] = result['subject_details'][counter];
											course['subjects']['count'][counter] = result['count'][counter];
											course['subjects']['sequence_no'][counter] = result['sequence_no'][counter];
											course['subjects']['elective_count'][counter] = result['elective_count'];
											callback();
										}
									});	
								});
							}
							else{
								//for normal b.tech students
								tasks.push(function(callback){
									var counter = sem;
									getCourseDetails(counter,sem,aggr_id,0,function(err,result){
										if(err) callback(err,result);
										else{
											console.log(result);
											course['subjects']['group_details'][counter] = result['group_details'];
											course['subjects']['subject_details'][counter] = result['subject_details'][counter];
											course['subjects']['count'][counter] = result['count'][counter];
											course['subjects']['sequence_no'][counter] = result['sequence_no'][counter];
											course['subjects']['elective_count'][counter] = result['elective_count'];
											callback();
										}
									});
								});
							}
						}
					}
				});
				async.parallel(tasks,function(err,result){
					if(err) callback1(err,result);
					else{
						callback1(err,{
							'course':course
						});
					}
				});
			}
		});	

	});
}


//flag for honour minor
function getCourseDetails(counter,sem,aggr_id,flag,callback1)
{
	var course = {};
	course['group_details'] = {};
	course['subject_details'] = {};
	course['sequence_no'] = {};
	course['elective_count'] = {};		
	getSubjectsBySem(counter,aggr_id,function(err,result){
		if(err) callback1(err,result);
		else
		{
			var result_ids = result;
			course['count'] = {};
			course['subject_details'][counter] = {};
			course['sequence_no'][counter] = {};
							
			course['count'][counter] = result_ids.length;
			console.log(result_ids.length);
			var parallel_tasks = [];
			var i = -1;
			result_ids.forEach(function(result_id){
				i++;
				result_id['num'] = i;
				
				parallel_tasks.push(function(callback){
					getSubjectDetails(result_id['id'],function(err,result){
						if(err){ callback(err,result);}
						else
						{
							console.log(result);
							course['subject_details'][counter][result_id['num']] = result[0];
							course['sequence_no'][counter][result_id['num']] = result_id['sequence'];
							if(!flag)
							{
								var group_id = result[0]['elective'];
								console.log(group_id);
								if(group_id != 0)
								{
									course['group_details'][group_id] = {};
									course['group_details'][group_id][counter] = {};
									
									course['group_details'][group_id][counter][result_id['num']] = group_id;
									getElectiveCount(group_id,function(err,result){
										if(err){ callback(err,result);}
										else
										{
											course['elective_count'][group_id] = result.length;
											selectElectiveGroupByGroupId(group_id,function(err,result){
												if(err){ callback(err,result);}
												else
												{
													course['group_details'][group_id] = result[0];
													course['group_id'] = 0;															
													callback();
												}
											});
										}
									});
								}
								else{
									callback();
								}
							}
							else{
								callback();
							}
						}
					});
				});
			});

			async.parallel(parallel_tasks,function(err,result){
				if(err) callback1(err,result);
				else{
					callback1(err,course);
				}
			});
		}
	});			
}

function getSubjectsBySem(sem,aggr_id,callback)
{
	var query = "SELECT DISTINCT * FROM course_structure WHERE semester = ? AND aggr_id = ? ORDER BY cast(SUBSTRING_INDEX(`sequence`, '.', 1) as decimal) asc, cast(SUBSTRING_INDEX(`sequence`, '.', -1) as decimal) asc";
	params = [];
	params.push(sem);
	params.push(aggr_id);
	db.query(query,params,callback);
}

function checkIfSyllabusExist(aggr_id,course_branch_id,callback)
{
	var query = "SELECT * FROM "+syllabus_table + " WHERE aggr_id = ? AND course_branch_id = ?";
	var params = [];
	params.push(aggr_id);
	params.push(course_branch_id);
	db.query(query,params,callback);
}

function selectCourseBranch(course_id,branch_id,callback){
	var query = "SELECT * FROM "+ course_branch_table+" WHERE course_id = ? AND branch_id = ?";
	params = [];
	params.push(course_id);
	params.push(branch_id);
	db.query(query,params,callback);
}

function selectElectiveGroupByGroupId(group_id,callback)
{
	var query = "SELECT DISTINCT * FROM "+elective_group_table+ " WHERE group_id = ?";
	params = [];params.push(group_id);
	db.query(query,params,callback);
}

function getElectiveCount(group_id,callback)
{
	var query = "SELECT * FROM "+subject_table+" WHERE elective = ?";
	params = [];params.push(group_id);
	db.query(query,params,callback);
}

function checkIfAggrIdExist(aggr_id)
{
	var query = "SELECT * FROM "+ dept_course_table + " WHERE aggr_id=?";
	params = [];params.push(aggr_id);
	db.query(query,params,function(err,result){
		if(!err && result.length >0) return true;
		else return false;
	});
}

function getBranchDetailsById(callback,id)
{
	var query = "SELECT * FROM "+branch_table+" WHERE id = ?";
	params = [];params.push(id);
	db.query(query,params,callback);
}

function getLatestAggrId(course,branch,expected_aggr_id,callback)
{
	var query = "SELECT aggr_id FROM dept_course INNER JOIN course_branch ON course_branch.course_branch_id = dept_course.course_branch_id WHERE course_branch.course_id = ? AND course_branch.branch_id = ? AND aggr_id <= ?  ORDER BY aggr_id DESC";
	params = [];
	params.push(course);
	params.push(branch);
	params.push(expected_aggr_id);
	db.query(query,params,callback);
}

function getDepts(callback)
{
	var query = "SELECT * FROM "+department_table+" WHERE type = ?";
	params = ['academic'];
	db.query(query,params,callback);
}

function getSubjectDetails(id,callback)
{
	var query = "SELECT * FROM "+subject_table+ " WHERE id = ?";
	params = [];params.push(id);
	db.query(query,params,callback);
}

function selectDeptByUserId(user_id,callback)
{
	var query = "SELECT * FROM "+user_details_table+" WHERE id = ?";
	params = [user_id];
	db.query(query,params,callback);
}

function getCourseDetailsById(callback,course_id){
	var query = "SELECT * FROM "+course_table+" WHERE id = ?";
	params = [];params.push(course_id);
	db.query(query,params,callback);
}

function countDeptCourseByAggrId(aggr_id,callback)
{
	var query = "SELECT * FROM "+dept_course_table+" WHERE aggr_id = ?";
	params = [aggr_id];
	db.query(query,params,function(err,result){
		if(!err) callback(null,{'count':result.length()});
		else callback(err,result);
	});	
}

function selectDeptCourse(callback){
	var query = "SELECT * FROM "+dept_course_table;
	db.query(query,params,callback);
}

function selectDeptCourseByDeptId	(dept_id,callback){
	var query = "SELECT * FROM "+dept_course_table+" WHERE 	dept_id = ?";
	params = [];params.push(dept_id);
	db.query(query,params,callback);
}

function insertDeptCourse(dept_course,callback){
	var query = "INSERT INTO "+dept_course_table+" VALUES(?,?,?,?)";
	params = [];
	params.push(dept_course['course_branch_id']);
	params.push(dept_course['dept_id']);
	params.push(dept_course['aggr_id']);
	params.push(dept_course['date']);
	db.query(query,params,callback);
}

function getCourse(callback){
	var query = "SELECT * FROM "+course_table;
	db.query(query,[],callback);
}

function deleteCourse(callback,course_id){
	var query = "DELETE FROM "+course_table+" WHERE id = ?";
	params = [];params.push(course_id);
	db.query(query,params,callback);
}



function getCourseOfferedByDept(callback,dept_id){
	var query = "SELECT DISTINCT course_branch.course_id,id,name,duration FROM "+course_table+" INNER JOIN "+course_branch_table+" ON course_branch.course_id = cs_courses.id INNER JOIN "+dept_course_table+" ON dept_course.course_branch_id = course_branch.course_branch_id WHERE dept_course.dept_id = ?";
	params = [];params.push(dept_id);
	db.query(query,params,callback);
}

function getCourseOfferedByDeptForStudentReg(callback,dept_id){
	var query = "SELECT DISTINCT course_branch.course_id,id,name,duration FROM 	courses INNER JOIN course_branch ON course_branch.course_id = courses.id INNER JOIN dept_course ON 	dept_course.course_branch_id = course_branch.course_branch_id WHERE dept_course.dept_id = ? AND courses.id != 'honour' AND courses.id != 'minor' AND courses.id != 'comm' ";
	params = [];params.push(dept_id);
	db.query(query,params,callback);	
}

function getBranchesByCourseAndDeptForStudentReg(callback,dept_id,course_id){
	var query = "SELECT DISTINCT id,name,dept_course.course_branch_id FROM branches INNER JOIN course_branch ON course_branch.branch_id = branches.id INNER JOIN dept_course ON dept_course.course_branch_id = course_branch.course_branch_id WHERE course_branch.course_id = ? AND dept_course.dept_id = ? AND branches.id != 'comm' AND branches.id != 'honour' AND branches.id != 'minor'";
	params = [];params.push(course_id);
	params.push(dept_id);
	db.query(query,params,callback);
}

function insertCourse(callback,course_details){
	var query = "INSERT INTO "+course_table+" VALUES(?,?,?)";
	params = [];
	params.push(course_details['id']);
	params.push(course_details['name']);
	params.push(course_details['duration']);
	db.query(query,params,callback);
}


function getBranches(callback){
	var query = "SELECT * FROM "+branch_table;
	db.query(query,[],callback);
}

function deleteBranch(callback,branch_id){
	var query = "DELETE FROM "+branch_table+" WHERE branch_id = ?";
	params = [];params.push(branch_id);
	db.query(query,params,callback);
}

function getBranchByCourse(callback,course_id){
	var query = "SELECT DISTINCT id,name FROM "+branch_table+" INNER JOIN "+course_branch_table+" ON course_branch.branch_id = cs_branches.id WHERE course_branch.course_id = ?";
	params = [];params.push(course_id);
	db.query(query,params,callback);	
}

function getBranchesByCourseAndDept(course_id,dept_id,callback){
	var query = "SELECT DISTINCT id,name,dept_course.course_branch_id FROM cs_branches INNER JOIN course_branch ON course_branch.branch_id = cs_branches.id INNER JOIN dept_course ON dept_course.course_branch_id = course_branch.course_branch_id WHERE course_branch.course_id = ? AND dept_course.dept_id = ?";
	params = [];
	params.push(course_id);
	params.push(dept_id);
	db.query(query,params,callback);
}



function getBranchOfferedByDept(dept_id)
{
	var query = "SELECT DISTINCT id,name FROM cs_branches INNER JOIN course_branch ON course_branch.branch_id = cs_branches.id INNER JOIN dept_course ON dept_course.course_branch_id = course_branch.course_branch_id WHERE dept_course.dept_id = ?";
	params = [];params.push(dept_id);
	db.query(query,params,callback);	
}

function insertBranch(branch_details,callback)
{
	var query = "INSERT INTO "+branch_table+ " VALUES(?,?)";
	params = [];
	params.push(branch_details['id']);
	params.push(branch_details['name']);
	db.query(query,params,callback);
}


function getSessionByCourseAndBranch(course_id,branch_id,callback){
	var query = "SELECT year FROM "+course_branch_table+" WHERE course_id = ? AND branch_id = ?";
	params = [];
	params.push(course_id);
	params.push(branch_id);
	db.query(query,params,callback);
}



function insertCourseBranch(course_branch_mapping){
	var query = "INSERT INTO "+course_branch_table+ " VALUES(?,?,?,?,?)";
	params = [];
	params.push(course_branch_mapping['course_branch_id']);
	params.push(course_branch_mapping['course_id']);
	params.push(course_branch_mapping['branch_id']);
	params.push(course_branch_mapping['year_starting']);
	params.push(course_branch_mapping['year_ending']);
	db.query(query,params,callback);
}



function getSubjectDetailsByGroupId(elective,callback)
{
	var query = "SELECT * FROM "+subject_table+" WHERE elective = ?";
	params = [];params.push(elective);
	db.query(query,params,callback);
}



function getSubjectsBySemAndDept(sem,aggr_id,dept_id,callback)
{
	var query = "SELECT * FROM course_structure INNER JOIN dept_course ON dept_course.aggr_id = course_structure.aggr_id WHERE semester = ? AND course_structure.aggr_id = ? AND dept_course.dept_id = ? ORDER BY cast(SUBSTRING_INDEX(`sequence`, '.', 1) as decimal) asc, cast(SUBSTRING_INDEX(`sequence`, '.', -1) as decimal) asc";
	params = [];
	params.push(sem);
	params.push(aggr_id);
	params.push(dept_id);
	db.query(query,params,callback);
}


function selectAllElectiveSubjectByAggrIdAndSem(aggr_id,sem,dept_id,callback)
{
	var query = "SELECT subjects.id,subject_id,name,lecture,tutorial,practical,credit_hours,contact_hours,elective,type, course_structure.aggr_id,course_structure.sequence FROM subjects INNER JOIN course_structure ON course_structure.id = subjects.id LEFT JOIN dept_course ON dept_course.aggr_id = course_structure.aggr_id WHERE course_structure.aggr_id = ? AND dept_course.dept_id = ? AND course_structure.semester = ? AND elective != '0' ORDER BY cast(SUBSTRING_INDEX(`sequence`, '.', 1) as decimal) asc, cast(SUBSTRING_INDEX(`sequence`, '.', -1) as decimal) asc";
	params = [];
	params.push(aggr_id);
	params.push(dept_id);
	params.push(sem);
	db.query(query,params,callback);
}

function selectAllHonourOrMinorSubjectByAggrIdAndSemester(callback,aggr_id,semester,course_id,branch_id,dept_id)
{
	var query = "SELECT	subjects.id,subject_id,subjects.name,lecture,tutorial,practical,credit_hours,contact_hours,elective,type,course_structure.aggr_id,course_structure.sequence FROM subjects INNER JOIN course_structure ON course_structure.id = subjects.id INNER JOIN dept_course ON dept_course.aggr_id = course_structure.aggr_id INNER JOIN course_branch ON course_branch.course_branch_id = dept_course.course_branch_id WHERE course_structure.aggr_id = ? AND dept_course.dept_id = ? AND course_structure.semester = ? AND course_branch.course_id = ? AND course_branch.branch_id = '$branch_id' ORDER BY cast(SUBSTRING_INDEX(`sequence`,'.', 1) as decimal) asc, cast(SUBSTRING_INDEX(`sequence`, '.', -1) as decimal) asc";
	params = [];
	params.push(aggr_id);
	params.push(dept_id);
	params.push(semester);
	params.push(course_id);
	params.push(branch_id);
	db.query(query,params,callback);
}

function selectAllSubjectByAggrIdAndSemester(aggr_id,semester,callback)
{
	var query = "SELECT * FROM subjects INNER JOIN course_structure ON course_structure.id = subjects.id WHERE course_structure.aggr_id = ? AND course_structure.semester = ?";
	params = [];
	params.push(aggr_id);
	params.push(semester);
	db.query(query,params,callback);
}

function getCourseStructureById(id,callback)
{
	var query = "SELECT * FROM "+course_structure_table + " WHERE id = ?";
	params = [];params.push(id);
	db.query(query,params,callback);
}




function deleteCourseStructure(semester,aggr_id,callback)
{
	var query  = "DELETE FROM "+course_structure_table+ " WHERE semester = ? AND course_structure = ?";
	params = [];
	params.push(semester);
	params.push(aggr_id);
	db.query(query,params,callback);	
}




function checkHonourMinorOffered(aggr_id,id)
{
	var query = "SELECT * FROM "+honour_minor_offered_table+ " WHERE aggr_id = ? AND id = ?";
	params = [];
	params.push(aggr_id);
	params.push(id);
	db.query(query,params,function(err,result)
	{
		if(!err&&sresult.lenght()>0) return true;
		else return false;
	});
}

function selectHonourMinorOfferedByAggrId(aggr_id,semester,callback)
{
	var query = "SELECT * FROM honour_minor_offered INNER JOIN course_structure ON course_structure.id = honour_minor_offered.id WHERE honour_minor_offered.aggr_id = ? AND course_structure.semester = ?";
	params = [];
	params.push(aggr_id);
	params.push(semester);
	db.query(query,params,callback);
}

function deleteHonourMinorOffered(aggr_id,semester,callback)
{
	var query = "DELETE honour_off FROM honour_minor_offered honour_off INNER JOIN course_structure ON course_structure.id = honour_off.id WHERE honour_off.aggr_id = ? AND course_structure.semester = semester";
	params = [];
	params.push(aggr_id);
	params.push(semester);
	db.query(aggr_id,semester,callback);
}

function insertHonourMinorOffered(data)
{
	//pending
}

var courseStructure = {
	insertHonourMinorOffered : insertHonourMinorOffered,
	deleteHonourMinorOffered : deleteHonourMinorOffered,
	selectHonourMinorOfferedByAggrId : selectHonourMinorOfferedByAggrId,
	checkHonourMinorOffered : checkHonourMinorOffered,
	getLatestAggrId : getLatestAggrId,
	deleteCourseStructure : deleteCourseStructure,
	getElectiveCount : getElectiveCount,
	selectElectiveGroupByGroupId : selectElectiveGroupByGroupId,
	getCourseStructureById : getCourseStructureById,
	selectAllSubjectByAggrIdAndSemester : selectAllSubjectByAggrIdAndSemester,
	selectAllHonourOrMinorSubjectByAggrIdAndSemester : selectAllHonourOrMinorSubjectByAggrIdAndSemester,
	selectAllElectiveSubjectByAggrIdAndSem : selectAllElectiveSubjectByAggrIdAndSem,
	checkIfAggrIdExist : checkIfAggrIdExist,
	getSubjectsBySemAndDept : getSubjectsBySemAndDept,
	getSubjectsBySem : getSubjectsBySem,
	getSubjectDetailsByGroupId : getSubjectDetailsByGroupId,
	getSubjectDetails : getSubjectDetails,
	insertCourseBranch : insertCourseBranch,
	selectCourseBranch : selectCourseBranch,
	getSessionByCourseAndBranch : getSessionByCourseAndBranch,
	insertBranch : insertBranch,
	getBranchOfferedByDept : getBranchOfferedByDept,
	getBranchDetailsById : getBranchDetailsById,	
	getBranchesByCourseAndDept : getBranchesByCourseAndDept,
	getBranchByCourse : getBranchByCourse,
	getBranches : getBranches,
	deleteBranch : deleteBranch,
	insertCourse : insertCourse,
	getBranchesByCourseAndDeptForStudentReg : getBranchesByCourseAndDeptForStudentReg,
	getCourseOfferedByDeptForStudentReg : getCourseOfferedByDeptForStudentReg,
	getCourseOfferedByDept : getCourseOfferedByDept,
	getCourseDetailsById : getCourseDetailsById,
	deleteCourse : deleteCourse,
	getCourse : getCourse,
	insertDeptCourse : insertDeptCourse,
	selectDeptCourseByDeptId : selectDeptCourseByDeptId,
	selectDeptCourse : selectDeptCourse,
	countDeptCourseByAggrId : countDeptCourseByAggrId,
	selectDeptByUserId : selectDeptByUserId,
	getDepts : getDepts,
	getAllFromDeptId : getAllFromDeptId,
	viewCourseStructure : viewCourseStructure
};

module.exports = courseStructure;