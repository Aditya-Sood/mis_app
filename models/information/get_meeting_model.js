/*
* @author rajatbajaj
*/

var db = require('config/db');
var db_tables = require('helper/db_tables');
var gen_api = require('models/general');

var date = require('date-and-time');
var info_minute_table = 'info_minute_table';
var individual_table = 'minute_individuals';


function getMinutes(data,callback)
{
	var date = data['date'];;
	var user_id = data['user_id'];
	var auth_id = data['auth_id'];
	var minute_cat = auth_id;
	var minute_type = '';
	var dept_id = data['dept_id'];
	var minute_dept = dept_id;
	var emp_type = '';
	var course_type = '';
	var sem_type = '';
	var async_serial_tasks = [];
	var course_id,semester;

	if(minute_cat == 'stu')
	{
		course_id = data['course_id'];
		semester = data['semester'];
	}
	else if(minute_cat == 'emp')
	{
		minute_type = emp_type = data['emp_type'];
	}

	var query="SELECT info_minute_details.*, user_details.*, auth_types.type as auth_name,departments.name as department, designations.name as designation FROM info_minute_details INNER JOIN user_details ON info_minute_details.issued_by=user_details.id INNER JOIN auth_types ON info_minute_details.auth_id=auth_types.id INNER JOIN emp_basic_details ON emp_basic_details.emp_no=user_details.id INNER JOIN departments ON user_details.dept_id=departments.id INNER JOIN designations ON designations.id = emp_basic_details.designation WHERE minutes_id in (SELECT minutes_group_id.minutes_id FROM notice_group INNER JOIN minutes_group_id ON notice_group.group_id=minutes_group_id.group_id where notice_group.user_id=? UNION SELECT minutes_id FROM minutes_individuals where minutes_individuals.user_id=? UNION SELECT minutes_id FROM info_minute_details WHERE meeting_cat='all' OR meeting_cat=? OR meeting_cat=? UNION SELECT minutes_id FROM minutes_gen_emp WHERE (meeting_cat='all'  OR meeting_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT minutes_id FROM minutes_general WHERE meeting_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_minute_details.posted_on desc";

	var params = [];
	params.push(user_id);
	params.push(user_id);
	params.push(minute_cat);
	params.push(minute_type);
	params.push(minute_cat);
	params.push(minute_dept);
	params.push(emp_type);
	params.push(minute_cat);
	params.push(minute_dept);
	params.push(course_id);
	params.push(semester);
	db.query(query,params,callback);
}


function getNewMinuteCount(data,callback){
	gen_api.getLastLoginDate(data['user_id'],function(err,result){
		if(err){
			callback({'message':'error in getting the last login date'},result);
		}
		else{
			if(result.length == 0)
				data['last_login_date'] = false;
			else{
				console.log(result[0]['time']);
				data['last_login_date'] = result[0]['time'];
			}
		}
		var user_id = data['user_id'];
		var auth_id = data['auth_id'];
		var minute_cat = auth_id;
		var minute_type = '';
		var dept_id = data['dept_id'];
		var minute_dept = dept_id;
		var emp_type = '';
		var course_type = '';
		var sem_type = '';
		var async_serial_tasks = [];
		var course_id,semester;

		if(minute_cat == 'stu')
		{
			course_id = data['course_id'];
			semester = data['semester'];
		}
		else if(minute_cat == 'emp')
		{
			minute_type = emp_type = data['emp_type'];
		}

		var query="SELECT info_minute_details.*, user_details.*, auth_types.type as auth_name,departments.name as department, designations.name as designation FROM info_minute_details INNER JOIN user_details ON info_minute_details.issued_by=user_details.id INNER JOIN auth_types ON info_minute_details.auth_id=auth_types.id INNER JOIN emp_basic_details ON emp_basic_details.emp_no=user_details.id INNER JOIN departments ON user_details.dept_id=departments.id INNER JOIN designations ON designations.id = emp_basic_details.designation WHERE minutes_id in (SELECT minutes_group_id.minutes_id FROM notice_group INNER JOIN minutes_group_id ON notice_group.group_id=minutes_group_id.group_id where notice_group.user_id=? UNION SELECT minutes_id FROM minutes_individuals where minutes_individuals.user_id=? UNION SELECT minutes_id FROM info_minute_details WHERE meeting_cat='all' OR meeting_cat=? OR meeting_cat=? UNION SELECT minutes_id FROM minutes_gen_emp WHERE (meeting_cat='all'  OR meeting_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT minutes_id FROM minutes_general WHERE meeting_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_minute_details.posted_on desc";

		var params = [];
		params.push(user_id);
		params.push(user_id);
		params.push(minute_cat);
		params.push(minute_type);
		params.push(minute_cat);
		params.push(minute_dept);
		params.push(emp_type);
		params.push(minute_cat);
		params.push(minute_dept);
		params.push(course_id);
		params.push(semester);


		if(!data['last_login_date'])
		{
			callback(false,{
				'count':0
			});
		}
		else{
			db.query(query,params,function(err,result){
				if(err)
				{
					callback(err,result);
				}	
				else
				{
					var count = 0;
					var d1 = new Date(data['last_login_date']);
					var timestamp1 = d1.getTime(); 
					result.forEach(function(post){
						if(new Date(post['posted_on']).getTime() > timestamp1)
						{
							count++;
						}
					});
					callback(false,{
						'count':count
					});
				}					
			});	
		}
		});
}

var minutes = {
	getMinutes:getMinutes,
	getNewMinuteCount:getNewMinuteCount
};

module.exports = minutes;