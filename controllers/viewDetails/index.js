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
				"err_code":8
			});
		}
	});

	if(session.getAuthId() == 'stu')
	{
		viewDetailsModel = require('models/student/student_details');
	}
	else if(session.getAuthId() == 'emp')
	{
		viewDetailsModel = require('models/employee/employee_details');
	}
	
	viewDetailsModel.getAllDetails(session.getId(),function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
			"status": 401,
			"err_code": 2
			});	
		}
		else
		{
			res.json(result);
		}
	});
});

module.exports = viewDetails;