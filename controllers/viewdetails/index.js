/**
 *Rajat Bajaj
**/

//route for setting end points
var viewDetails = require('express').Router();
var Session = require('config/session');
var viewDetailsModel;

viewDetails.get('/',function(req,res){
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
	if(session.getAuthId() == 'stu')
	{
		viewDetailsModel = require('models/student/student_details');
	}
	else if(session.getAuthId() == 'emp')
	{
		viewDetailsModel = require('models/employee/employee_details');
	}
	
	viewDetailsModel.getAllDetails(session.getId(),session.getDeptId(),function(err,result){
		if(err)
		{
			res.json({
					'success':false,
					'err_msg':'error in getting details'
					});	
		}
		else
		{
			res.json({
				'success':true,
				'auth':auth,
				'details':result
			});
		}
	});
});

module.exports = viewDetails;