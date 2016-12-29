/**
 *Rajat Bajaj
**/

//route for setting end points
var courseStructure = require('express').Router();
var courseStructureModel = require('models/courseStructure');


/*
*https://app.mis.com/api/v1/coursestructure/departments?access_token=?
*/
courseStructure.get('/departments',function(req,res){
	courseStructureModel.getDepts(function(err,result){
		if(err) {
			res.status(401);
			res.json({
				'status':401,
				'err_msg':err.message
			});
		}
		else
		{
			res.json(result);
		}
	});
}) ;


/*
*https://app.mis.com/api/v1/coursestructure/courses?access_token=?&dept_id=?
*/
courseStructure.get('/courses',function(req,res){
	var dept_id = req.query.dept_id;
	console.log("depat##########################3");
	if(dept_id)
	{
		courseStructureModel.getCourseOfferedByDept(function(err,result){
			if(err) {
				res.status(401);
				res.json({
					'status':401,
					'err_msg':err.message
				});
			}
			else
			{
				res.json(result);
			}
		},dept_id);
	}
	else
	{
		res.json({'status':401,'err_msg':'missing parameters'});
	}
});

/*
*https://app.mis.com/api/v1/coursestructure/courses?access_token=?&dept_id=?
*/

module.exports = courseStructure;