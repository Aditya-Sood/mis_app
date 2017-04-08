/*
* @author rajatbajaj
*/

var db_tables = require('helper/db_tables');

var info_circular_table = 'info_circular_table';
var individual_table = 'notice_individuals';
var gen_api = require('models/general');
var db = require('config/db');

var date = require('date-and-time');


function getCircularIds(data,callback)
{
	/*
	* unverified query
	*/


	var date = data['date'];
	var user_id = data['user_id'];
	var auth_id = data['auth_id'];
	var circular_cat = auth_id;
	var circular_type = '';
	var dept_id = data['dept_id'];
	var circular_dept = dept_id;
	var emp_type = '';
	var course_type = '';
	var sem_type = '';
	var async_serial_tasks = [];
	var course_id,semester;

	if(circular_cat == 'stu')
	{
		course_id = data['course_id'];
		semester = data['semester'];
	}
	else if(circular_cat == 'emp')
	{
		circular_type = emp_type = data['emp_type'];
	}

	var query = "SELECT circular_id FROM info_circular_details WHERE circular_id in (SELECT  circular_group_id.circular_id FROM circular_group INNER JOIN circular_group_id ON circular_group.group_id=circular_group_id.group_id where circular_group.user_id=? UNION SELECT circular_id FROM circular_individuals where circular_individuals.user_id=? UNION SELECT circular_id FROM info_circular_details WHERE circular_cat='all' OR circular_cat=? OR circular_cat=? UNION SELECT circular_id FROM circular_gen_emp WHERE  (circular_cat=?  OR circular_cat='$circular_cat') AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT circular_id FROM circular_general WHERE circular_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_circular_details.posted_on desc";

	var params = [];
	params.push(user_id);
	params.push(user_id);
	params.push(circular_cat);
	params.push(circular_type);
	params.push(circular_cat);
	params.push(circular_dept);
	params.push(emp_type);
	params.push(circular_cat);
	params.push(circular_dept);
	params.push(course_id);
	params.push(semester);

	db.query(query,params,callback);
}

function getCirculars(data,callback)
{
	var query = "SELECT info_circular_details.*, user_details.*, auth_types.type as auth_name,departments.name as department, designations.name as designation FROM info_circular_details INNER JOIN user_details ON info_circular_details.issued_by=user_details.id INNER JOIN auth_types ON info_circular_details.auth_id=auth_types.id INNER JOIN emp_basic_details ON emp_basic_details.emp_no=user_details.id INNER JOIN departments ON user_details.dept_id=departments.id INNER JOIN designations ON designations.id = emp_basic_details.designation WHERE circular_id in (SELECT  circular_group_id.circular_id FROM notice_group INNER JOIN circular_group_id ON notice_group.group_id=circular_group_id.group_id where notice_group.user_id=? UNION SELECT circular_id FROM circular_individuals where circular_individuals.user_id=? UNION SELECT circular_id FROM info_circular_details WHERE circular_cat='all' OR circular_cat=? OR circular_cat=? UNION SELECT circular_id FROM circular_gen_emp WHERE  (circular_cat='all'  OR circular_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT circular_id FROM circular_general WHERE circular_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_circular_details.posted_on desc";
	var date = data['date'];
	var user_id = data['user_id'];
	var auth_id = data['auth_id'];
	var circular_cat = auth_id;
	var circular_type = '';
	var dept_id = data['dept_id'];
	var circular_dept = dept_id;
	var emp_type = '';
	var course_type = '';
	var sem_type = '';
	var async_serial_tasks = [];
	var course_id,semester;

	if(circular_cat == 'stu')
	{
		course_id = data['course_id'];
		semester = data['semester'];
	}
	else if(circular_cat == 'emp')
	{
		circular_type = emp_type = data['emp_type'];
	}

	var params = [];
	params.push(user_id);
	params.push(user_id);
	params.push(circular_cat);
	params.push(circular_type);
	params.push(circular_cat);
	params.push(circular_dept);
	params.push(emp_type);
	params.push(circular_cat);
	params.push(circular_dept);
	params.push(course_id);
	params.push(semester);
	db.query(query,params,callback);
}

function getNewCircularCount(data,callback){
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
		var circular_cat = auth_id;
		var circular_type = '';
		var dept_id = data['dept_id'];
		var circular_dept = dept_id;
		var emp_type = '';
		var course_type = '';
		var sem_type = '';
		var async_serial_tasks = [];
		var course_id,semester;

		if(circular_cat == 'stu')
		{
			course_id = data['course_id'];
			semester = data['semester'];
		}
		else if(circular_cat == 'emp')
		{
			circular_type = emp_type = data['emp_id'];
		}


		var query="SELECT info_circular_details.*, user_details.*, auth_types.type as auth_name,departments.name as department, designations.name as designation FROM info_circular_details INNER JOIN user_details ON info_circular_details.issued_by=user_details.id INNER JOIN auth_types ON info_circular_details.auth_id=auth_types.id INNER JOIN emp_basic_details ON emp_basic_details.emp_no=user_details.id INNER JOIN departments ON user_details.dept_id=departments.id INNER JOIN designations ON designations.id = emp_basic_details.designation WHERE circular_id in (SELECT circular_group_id.circular_id FROM notice_group INNER JOIN circular_group_id ON notice_group.group_id=circular_group_id.group_id where notice_group.user_id=? UNION SELECT circular_id FROM circular_individuals where circular_individuals.user_id=? UNION SELECT circular_id FROM info_circular_details WHERE circular_cat='all' OR circular_cat=? OR circular_cat=? UNION SELECT circular_id FROM circular_gen_emp WHERE (circular_cat='all'  OR circular_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT circular_id FROM circular_general WHERE circular_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_circular_details.posted_on desc";

		var params = [];
		params.push(user_id);
		params.push(user_id);
		params.push(circular_cat);
		params.push(circular_type);
		params.push(circular_cat);
		params.push(circular_dept);
		params.push(emp_type);
		params.push(circular_cat);
		params.push(circular_dept);
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
	
var circulars = {
	getCircularIds:getCircularIds,
	getCirculars:getCirculars,
	getNewCircularCount:getNewCircularCount
};

module.exports = circulars;