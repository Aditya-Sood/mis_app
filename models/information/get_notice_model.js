/*
* @author rajatbajaj
*/

var db_tables = require('config/db_tables');

var info_notice_table = 'info_notice_table';
var individual_table = 'notice_individuals';

function getNoticeIds(data,callback)
{
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

	var query = "SELECT notice_id FROM info_notice_details WHERE notice_id in (SELECT  notice_group_id.notice_id FROM notice_group INNER JOIN notice_group_id ON notice_group.group_id=notice_group_id.group_id where notice_group.user_id=? UNION SELECT notice_id FROM notice_individuals where notice_individuals.user_id=? UNION SELECT notice_id FROM info_notice_details WHERE notice_cat='all' OR notice_cat=? OR notice_cat=? UNION SELECT notice_id FROM notice_gen_emp WHERE  (notice_cat='all'  OR notice_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT notice_id FROM notice_general WHERE notice_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_notice_details.posted_on desc";
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

function getNotices(data,callback)
{
	date = data['date'];;
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

	var query="SELECT info_notice_details.*, user_details.*, auth_types.type as auth_name,departments.name as department, designations.name as designation FROM info_notice_details INNER JOIN user_details ON info_notice_details.issued_by=user_details.id INNER JOIN auth_types ON info_notice_details.auth_id=auth_types.id INNER JOIN emp_basic_details ON emp_basic_details.emp_no=user_details.id INNER JOIN departments ON user_details.dept_id=departments.id INNER JOIN designations ON designations.id = emp_basic_details.designation WHERE notice_id in (SELECT notice_group_id.notice_id FROM notice_group INNER JOIN notice_group_id ON notice_group.group_id=notice_group_id.group_id where notice_group.user_id=? UNION SELECT notice_id FROM notice_individuals where notice_individuals.user_id=? UNION SELECT notice_id FROM info_notice_details WHERE notice_cat='all' OR notice_cat=? OR notice_cat=? UNION SELECT notice_id FROM notice_gen_emp WHERE (notice_cat='all'  OR notice_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT notice_id FROM notice_general WHERE notice_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_notice_details.posted_on desc";

	var params = [];
	params.push(user_id);
	params.push(notice_cat);
	params.push(notice_type);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(emp_type);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(course_type);
	params.push(sem_type);
	db.query(query,params,callback);
}


function getNewNoticeCount(data,callback)
{
	var last_login_date = data['last_login_date'];
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


	var query = "SELECT * FROM info_notice_details WHERE notice_id in (SELECT  notice_group_id.notice_id FROM notice_group INNER JOIN notice_group_id ON notice_group.group_id=notice_group_id.group_id where notice_group.user_id=? UNION SELECT notice_id FROM notice_individuals where notice_individuals.user_id=? UNION SELECT notice_id FROM info_notice_details WHERE notice_cat=? OR notice_cat=? OR notice_cat=? UNION SELECT notice_id FROM notice_gen_emp WHERE  (notice_cat=?  OR notice_cat=?) AND (dept_id=? OR dept_id='all') AND (emp_auth_id=? OR emp_auth_id='all') UNION SELECT notice_id FROM notice_general WHERE notice_cat=? AND (dept_id=? OR dept_id='all' ) AND (course_id=? OR course_id='all') AND (Semester=? OR Semester='all')) ORDER BY info_notice_details.posted_on desc";

	var params = [];
	params.push(user_id);
	params.push(user_id);
	params.push(notice_cat);
	params.push(notice_type);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(emp_type);
	params.push(notice_cat);
	params.push(notice_dept);
	params.push(course_type);
	params.push(sem_type);	

	if(!last_login_date)
	{
		callback(false,{
			'count':0
		});
	}
	else{
		db.query(query,params,function(err,result){
			if(err)
				callback(err,result);
			else
				callback(false,{
					'count':result.length
				});
		});	
	}
	
}

function getGeneralStuData(notice_id,callback)
{
	var query="SELECT course_id,semester from notice_general where notice_id=?";
	var params = [];params.push(notice_id)	
	db.query(query,params,callback);
}


var notices = {
	getNoticeIds:getNoticeIds,
	getNotices:getNotices,
	getGeneralStuData:getGeneralStuData,
	getNewNoticeCount:getNewNoticeCount
};

module.exports = notices;