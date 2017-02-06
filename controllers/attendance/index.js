/**
 * @Rajat Bajaj
**/

//route for setting end points
var attendance = require('express').Router();
var attendanceModel = require('models/attendance');
var Session = require('config/session');
var empAttendanceModel = require('models/attendance/emp_attendance_model');

attendance.get('/sessionyear',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	attendanceModel.getSessionYear(adm_no,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"success":false,
				"err_msg":err.message
			});
		}
		else
		res.json(result);
	});
});

attendance.get('/semester',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	attendanceModel.getSemester(adm_no,req.query.sessionyear,req.query.session,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"success":false,
				"err_msg":err.message
			});
		}
		else
		res.json(result);
	});
});

attendance.get('/subjectlist',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	var data = {};
	data['adm_no'] = adm_no;
	data['session'] = req.query.session;
	data['session_year'] = req.query.sessionyear;
	data['semester'] = req.query.semester;
	attendanceModel.getSubjectList(data,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"success":false,
				"err_msg":err.message
			});
		}
		else
		{
			res.json({
				"success":true,
				"subjectlist":result
			});
		}
		
	});
});


attendance.get('/studentattendance',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	var data = {};
	data['adm_no'] = adm_no;
	data['session'] = req.query.session;
	data['session_year'] = req.query.sessionyear;
	data['semester'] = req.query.semester;
	attendanceModel.getAttendanceDetails(data,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"success":false,
				"err_msg":err.message
			});
		}
		else
		{
			res.json({
				"success":true,
				"attendance":result
			});
		}	
	});
});


attendance.get('/subjectattendance',function(req,res){

	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var adm_no = session.getId();
	var data = {};
	data['adm_no'] = adm_no;
	data['sub_id'] = req.query.sub_id;
	data['map_id'] = req.query.map_id;

	attendanceModel.getDetailedAttendanceOfSubject(data,function(err,result){
		if(err){
			res.status(401);
			res.json({
				"success":false,
				"err_msg":err.message
			});	
		}else{
			res.json({
				"success":true,
				"attendance":result
			});
		}
	});
});


//This is for teacher that can see attendance of all students
attendance.get('/subjectattendanceall',function(req,res){
	data['adm_no'] = req.query.adm_no;
	data['sub_id'] = req.query.sub_id;
	data['map_id'] = req.query.map_id;

	attendanceModel.getDetailedAttendanceOfSubject(data,function(err,result){
		if(err){
			res.status(401);
			res.json({
				"success":false,
				"err_msg":err.message
			});	
		}else{
			res.json({
				"success":true,
				"attendance":result
			});
		}
	});
});

attendance.get('/subjectmapped',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});

	var emp_id = session.getId();
	var data = [];
	data['emp_id'] = emp_id;
	if(req.query.session && req.query.sessionyear)
	{
		console.log(empAttendanceModel);
		data['session'] = req.query.session;
		data['session_year'] = req.query.sessionyear;
		empAttendanceModel.getSubjectsMappedToEmployee(data,function(err,result){
			if(err)
			{
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'subjects':result
				});
			}
		});
	}
	else{
		res.status(401);
		res.json({
			'success':false,
			'err_msg':'missing parameters' 
		});
	}
});

attendance.get('/viewattendancesheet',function(req,res){
	var session = new Session(req.query.access_token,function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
				"status":401,
				"err_code":8,
				"err_msg":'some problem in session'
			});
		}
	});
	var data = {};
	data['emp_id'] = session.getId();
	data['session_year'] = req.query.session_year;
	data['branch_name'] = req.query.branch_name;
	data['course_name'] = req.query.course_name;
	data['session'] = req.query.session;
	data['sub_id'] = req.query.sub_id;
	data['branch_id'] = req.query.branch_id;
	data['course_id'] = req.query.course_id;
	data['sub_name'] = req.query.sub_name;
	data['semester'] = req.query.semester;
	if(data['course_id'] == 'comm')
	{
		data['group'] = req.query.group;
		data['section'] = req.query.section;
	}
	empAttendanceModel.viewAttendanceSheet(data,function(err,result){
		if(err)
			{
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'att_sheet':result
				});
			}
	});
});


module.exports = attendance;