/**
 *Rajat Bajaj
**/

//route for setting end points
var viewDetails = require('express').Router();
var Session = require('config/session');
var viewStudentDetailsModel = require('models/student/student_details');


viewDetails.get('/',function(req,res){
	var session = new Session(req.query.access_token);
	
	viewStudentDetailsModel.getAllDetails(session.getId(),function(err,result){
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