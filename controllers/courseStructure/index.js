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
				'success':false,
				'status':401,
				'err_msg':err.message
			});
		}
		else
		{
			res.json({'success':true,'departments':result});
		}
	});
}) ;


/*
*https://app.mis.com/api/v1/coursestructure/courses?access_token=?&dept_id=?
*/
courseStructure.get('/courses',function(req,res){
	var dept_id = req.query.dept_id;
	if(dept_id)
	{
		courseStructureModel.getCourseOfferedByDept(function(err,result){
			if(err) {
				res.status(401);
				res.json({
					'success':true,
					'status':401,
					'err_msg':err.message
				});
			}
			else
			{
				res.json({'success':true,
					'courses':result});
			}
		},dept_id);
	}
	else
	{
		res.json({'success':false,'status':401,'err_msg':'missing parameters'});
	}
});



/*
*https://app.mis.com/api/v1/coursestructure/coursedetails?access_token=?&dept_id=?
*/
courseStructure.get('/coursesdetails',function(req,res){
	var dept_id = req.query.dept_id;
	if(dept_id)
	{
		courseStructureModel.getAllFromDeptId(dept_id,function(err,result){
			if(err){
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}
			else
			{
				res.json({
					'success':true,
					'course_details':AddSemester(result)
				});
			}
		});
	}
	else
	{
		res.json({'success':false,'status':401,'err_msg':'missing parameters'});
	}
});

/*
*https://app.mis.com/api/v1/coursestructure/viewcourse?access_token=?&session=?&semester=?&branch_id=?&course=?&dept_id=?
*/
courseStructure.get('/viewcourse',function(req,res){
	var dept_id = req.query.dept_id;
	var session = req.query.session;
	var semester = req.query.semester;
	var branch_id = req.query.branch_id;
	var course = req.query.course;

	var data = {};
	data['dept_id'] = dept_id;
	data['session'] = session;
	data['semester'] = semester;
	data['branch_id'] = branch_id;
	data['course'] = course;
	data['group'] = 2;

	if(dept_id && session && semester && branch_id && course)
	{
		courseStructureModel.viewCourseStructure(data,function(err,result){
			if(err){
				res.status(401);
				res.json({
					'success':false,
					'err_msg':err.message
				});
			}else{
				res.json({
					'success':true,
					'course_details':result
				});
			}	
		});
	}
	else
	{
		res.status(401);
		res.json({'success':false,'err_msg':'missing parameters'});	
	}
});


function AddSemester(data)
{
	var result = data;
	for(var i=0;i<result.length;i++)
	{
		sem_list = [];
		if(result[i]['course_id'] == "honour" || result[i]['course_id'] == "minor")
		{
			for(var counter = 5;counter<=8;counter++)
			{
				sem_list.push(counter);
			}
		}else if(result[i]['course_id'] == 'prep')
		{
			sem_list.push(-1);
			sem_list.push(0);
		}
		else if(result[i]['course_id'] == 'b.tech' || result[i]['course_id'] == 'dualdegree')
		{
			for(var counter = 3;counter<=2*result[i]['duration'];counter++)
			{
				sem_list.push(counter);
			}
		}
		else
		{
			if(result[i]['duration'] < 4)
			{
				for(var counter=1;counter<=2*result[i]['duration'];counter++)
				{
					sem_list.push(counter);
				}
			}
			else
			{
				for(var counter=1;counter<=2*result[i]['duration'];counter++)
				{
					sem_list.push(counter);
				}	
			}
		}
		result[i]['sem_list'] = sem_list;
	}
	return result;
}



module.exports = courseStructure;