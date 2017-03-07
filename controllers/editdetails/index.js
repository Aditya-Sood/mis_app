/**
 *Rajat Bajaj
**/

//route for setting end points
var editDetails = require('express').Router();
var emp_edit_details_model = require('models/employee/edit_employee_details');
var stu_edit_details_model = require('models/student/edit_student_details');


editDetails.post('/editselfdetails',function(req,res){
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

	var auth = session.getAuthId();
	if(auth == 'emp')
	{
		emp_edit_details_model.editSelfDetails(req.query,function(err,result){
			if(err){
				res.status(401);
				res.json({
					'success':false,
					'err_msg' : err.message
				});
			}
			else{
				res.json({
					'success':true,
					'msg':'information updated successfully'
				});
			}
		});
	}
	else if(auth == 'stu')
	{
		stu_edit_details_model.updateAllDetails(req.query,function(err,result){
			if(err) {
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else{
				res.json({
					'success':true,
					'msg':'infromation updated successfully'
				});
			}
		});
	}
}) ;

module.exports = editDetails;