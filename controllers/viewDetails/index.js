/**
 *Rajat Bajaj
**/

//route for setting end points
var viewDetails = require('express').Router();
var Session = require('config/session');
var viewStudentDetailsModel = require('models/student/student_details');


viewDetails.get('/',function(req,res){
	var session = new Session(req.query.access_token);
	console.log(req.query.access_token);
	viewStudentDetailsModel.initializeVariables(session.getId(),function(err,result){
		if(err)
		{
			res.status(401);
			res.json({
			"status": 401,
			"err_code": 2
			});
		}else{
			viewStudentDetailsModel.getPersonalDetails(session.getId(),function(err,result1){
				res.json(result1);
			})
		}
	});
}) ;

module.exports = viewDetails;