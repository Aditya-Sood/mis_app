/*
* @author rajatbajaj
*/

var db_tables = require('config/db_tables');

var info_circular_table = 'info_circular_table';

function getCircularIds(data,callback)
{
	var date = data['date'];
	var user_id = data['user_id'];
	var auth_id = data['auth_id'];
	var notice_cat = auth_id;
	var notice_type = '';
	var dept_id = data['dept_id'];
	var notice_dept = dept_id;
	var emp_type = '';
	var course_type = '';
	var sem_type = '';
	var async_serial_tasks = [];
	var course_id,semester;

	if(notice_cat == 'stu')
	{
		course_id = data['course_id'];
		semester = data['semester'];
	}
	else if(notice_cat == 'emp')
	{
		notice_type = emp_type = data['emp_id'];
	}

	var query = "SELECT circular_id FROM info_circular_details WHERE circular_id in (SELECT  circular_group_id.circular_id FROM notice_group INNER JOIN circular_group_id ON notice_group.group_id=circular_group_id.group_id where notice_group.user_id=? UNION SELECT circular_id FROM circular_individuals where circular_individuals.user_id=? UNION SELECT circular_id FROM info_circular_details WHERE circular_cat='all' OR circular_cat=? OR circular_cat=? UNION SELECT circular_id FROM circular_gen_emp WHERE  (circular_cat=?  OR circular_cat='$notice_cat') AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT circular_id FROM circular_general WHERE circular_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_circular_details.posted_on desc";

	var params = [];
	params.push(notice_type);
	params.push(notice_cat);
	params.push(user_id);
	params.push(user_id);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(emp_type);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(course_type);
	params.push(sem_type);
}

function getCirculars()
{
	var query = "SELECT info_circular_details.*, user_details.*, auth_types.type as auth_name,departments.name as department, designations.name as designation FROM info_circular_details INNER JOIN user_details ON info_circular_details.issued_by=user_details.id INNER JOIN auth_types ON info_circular_details.auth_id=auth_types.id INNER JOIN emp_basic_details ON emp_basic_details.emp_no=user_details.id INNER JOIN departments ON user_details.dept_id=departments.id INNER JOIN designations ON designations.id = emp_basic_details.designation WHERE circular_id in (SELECT  circular_group_id.circular_id FROM notice_group INNER JOIN circular_group_id ON notice_group.group_id=circular_group_id.group_id where notice_group.user_id=? UNION SELECT circular_id FROM circular_individuals where circular_individuals.user_id=? UNION SELECT circular_id FROM info_circular_details WHERE circular_cat='all' OR circular_cat=? OR circular_cat=? UNION SELECT circular_id FROM circular_gen_emp WHERE  (circular_cat='all'  OR circular_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT circular_id FROM circular_general WHERE circular_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_circular_details.posted_on desc";
	var date = data['date'];
	var user_id = data['user_id'];
	var auth_id = data['auth_id'];
	var notice_cat = auth_id;
	var notice_type = '';
	var dept_id = data['dept_id'];
	var notice_dept = dept_id;
	var emp_type = '';
	var course_type = '';
	var sem_type = '';
	var async_serial_tasks = [];
	var course_id,semester;

	if(notice_cat == 'stu')
	{
		course_id = data['course_id'];
		semester = data['semester'];
	}
	else if(notice_cat == 'emp')
	{
		notice_type = emp_type = data['emp_id'];
	}

	var params = [];
	params.push(notice_type);
	params.push(notice_cat);
	params.push(user_id);
	params.push(user_id);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(emp_type);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(course_type);
	params.push(sem_type);		

	db.query(query,params,callback);
}
	
var circulars = {
	getCircularIds:getCircularIds,
	getCirculars:getCirculars
};

module.exports = circulars;