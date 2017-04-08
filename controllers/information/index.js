/**
 *Rajat Bajaj
**/

//route for setting end points
var postDetails = require('express').Router();
var noticeModel = require('models/information/get_notice_model');
var circularModel = require('models/information/get_circular_model');
var minuteModel = require('models/information/get_meeting_model');
var async = require('async');
var Session = require('config/session');
var gen_api = require('models/general');


postDetails.get('/getgeneraldata',function(req,res){
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

	noticeModel.getGeneralStuData(session.getId(),function(err,result){
		if(err){
			res.json({
				success : false,
				err_msg : 'error in getting student course and semester'
			});
		}
		else{
			res.json({
				success : true,
				details : result[0]
			});
		}
	})
});


postDetails.get('/getnewnoticecount',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				noticeModel.getNewNoticeCount(data,function(err,result){
					if(err){
						res.json({
							'success':false,
							'err_msg':'error in getting notice details'
						});			
					}else{
						res.json({
							'success':true,
							'notice_id':result
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		noticeModel.getNewNoticeCount(data,function(err,result){
		if(err){
			res.json({
				'success':false,
				'err_msg':'error in getting notice details'
			});			
		}else{
			res.json({
				'success':true,
				'notice_id':result
			});
		}
		});
	}
});

postDetails.get('/getnotices',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				noticeModel.getNotices(data,function(err,result){
					if(err){
						res.json({
							'success':false,
							'err_msg':'error in getting notice details'
						});			
					}else{
						res.json({
							'success':true,
							'notice_id':result
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		noticeModel.getNotices(data,function(err,result){
		if(err){
			res.json({
				'success':false,
				'err_msg':'error in getting notice details'
			});			
		}else{
			res.json({
				'success':true,
				'notice_id':result
			});
		}
		});
	}
});

postDetails.get('/getnoticeids',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				noticeModel.getNoticeIds(data,function(err,result){
					if(err){
						res.json({
							'success':false,
							'err_msg':'error in getting notice details'
						});			
					}else{
						res.json({
							'success':true,
							'notice_id':result
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		noticeModel.getNoticeIds(data,function(err,result){
		if(err){
			res.json({
				'success':false,
				'err_msg':'error in getting notice details'
			});			
		}else{
			res.json({
				'success':true,
				'notice_id':result
			});
		}
		});
	}
});

postDetails.get('/getcirculars',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				circularModel.getCirculars(data,function(err,result){
					if(err){
						res.json({
							'success':false,
							'err_msg':'error in getting circular details'
						});			
					}else{
						res.json({
							'success':true,
							'circulars':result
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		circularModel.getCirculars(data,function(err,result){
		if(err){
			res.json({
				'success':false,
				'act_err':err.message,
				'err_msg':'error in getting circular details'
			});			
		}else{
			res.json({
				'success':true,
				'circulars':result
			});
		}
		});
	}
});

postDetails.get('/getnewcircularcount',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				circularModel.getNewCircularCount(data,function(err,result){
					if(err){
						res.json({
							'success':false,
							'err_msg':'error in getting circulars new count details'
						});			
					}else{
						res.json({
							'success':true,
							'circular_count':result
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		circularModel.getNewCircularCount(data,function(err,result){
		if(err){
			res.json({
				'success':false,
				'err_msg':'error in getting circulars new count details'
			});			
		}else{
			res.json({
				'success':true,
				'circular_count':result
			});
		}
		});
	}
});

postDetails.get('/getminutes',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				minuteModel.getMinutes(data,function(err,result){
					if(err){
						res.json({
							'success':false,
							'err_msg':'error in getting circular details'
						});			
					}else{
						res.json({
							'success':true,
							'minutes':result
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		minuteModel.getMinutes(data,function(err,result){
		if(err){
			res.json({
				'success':false,
				'act_err':err.message,
				'err_msg':'error in getting circular details'
			});			
		}else{
			res.json({
				'success':true,
				'minutes':result
			});
		}
		});
	}
});

postDetails.get('/getnewminutecount',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				minuteModel.getNewMinuteCount(data,function(err,result){
					if(err){
						res.json({
							'success':false,
							'err_msg':'error in getting circulars new count details'
						});			
					}else{
						res.json({
							'success':true,
							'minute_count':result
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		minuteModel.getNewMinuteCount(data,function(err,result){
		if(err){
			res.json({
				'success':false,
				'err_msg':'error in getting circulars new count details'
			});			
		}else{
			res.json({
				'success':true,
				'minute_count':result
			});
		}
		});
	}
});


postDetails.get('/counts',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				var async_tasks = [];
				var new_notice_count = 0,new_circular_count =0 ,new_minutes_count =0;
				async_tasks.push(function(callback){
					circularModel.getNewCircularCount(data,function(err,result){
						if(!err) new_circular_count = result['count'];
						callback(err,result);
					});
				});
				async_tasks.push(function(callback){
					minuteModel.getNewMinuteCount(data,function(err,result){
						if(!err) new_minutes_count = result['count'];
						callback(err,result) 
					});
				})

				async_tasks.push(function(callback){
					noticeModel.getNewNoticeCount(data,function(err,result){
						if(!err) new_notice_count = result['count'];
						callback(err,result);
					});
				});
				
				async.parallel(async_tasks,function(err,result){
					if(err) {
						res.json({
							'success':false,
							'err_msg':'error in getting new counts'
						});	
					}
					else{
						res.json({
							'success':true,
							'new_notice_count':new_notice_count,
							'new_circular_count':new_circular_count,
							'new_minutes_count':new_minutes_count
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		
		var async_tasks = [];
		
		var new_notice_count = 0,new_circular_count =0 ,new_minutes_count =0;
		async_tasks.push(function(callback){
			circularModel.getNewCircularCount(data,function(err,result){
				if(!err) new_circular_count = result['count'];
				callback(err,result);
			});
		});
		async_tasks.push(function(callback){
			minuteModel.getNewMinuteCount(data,function(err,result){
				if(!err) new_minutes_count = result['count'];
				callback(err,result) 
			});
		})

		async_tasks.push(function(callback){
			noticeModel.getNewNoticeCount(data,function(err,result){
				if(!err) new_notice_count = result['count'];
				callback(err,result);
			});
		});
		
		async.parallel(async_tasks,function(err,result){
			if(err) {
				res.json({
					'success':false,
					'err_msg':'error in getting new counts'
				});	
			}
			else{
				res.json({
					'success':true,
					'new_notice_count':new_notice_count,
					'new_circular_count':new_circular_count,
					'new_minutes_count':new_minutes_count
				});
			}
		});
	}
});


postDetails.get('/postdetails',function(req,res){
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
	data['dept_id'] = session.getDeptId();
	data['user_id'] = session.getId();
	data['auth_id'] = session.getAuthId();

	if(data['auth_id'] == 'stu')
	{
		gen_api.getGeneralStuData(session.getId(),function(err,result){
			
			if(err || result.length == 0)
			{
				res.json({
					'success':false,
					'err_msg':'error in getting stu basic details'
				});
			}
			else{
				data['course_id'] = result[0]['course_id'];
				data['semester'] = result[0]['semester'];
				var async_tasks = [];
				var notices,circulars,minutes;
				async_tasks.push(function(callback){
					circularModel.getCirculars(data,function(err,result){
						if(!err) circulars = result;
						callback(err,result);
					});
				});
				async_tasks.push(function(callback){
					minuteModel.getMinutes(data,function(err,result){
						if(!err) minutes = result;
						callback(err,result) 
					});
				})

				async_tasks.push(function(callback){
					noticeModel.getNotices(data,function(err,result){
						if(!err) notices = result;
						callback(err,result);
					});
				});
				
				async.parallel(async_tasks,function(err,result){
					if(err) {
						res.json({
							'success':false,
							'err_msg':'error in getting new counts'
						});	
					}
					else{
						res.json({
							'success':true,
							'notices':notices,
							'circulars':circulars,
							'minutes':minutes
						});
					}
				});
			}
		}); 
	}
	else if(data['auth_id'] == 'emp')
	{
		data['emp_type'] = session.getEmpType();
		
		var async_tasks = [];
		var notices,circulars,minutes;
		async_tasks.push(function(callback){
			circularModel.getCirculars(data,function(err,result){
				if(!err) circulars = result;
				callback(err,result);
			});
		});
		async_tasks.push(function(callback){
			minuteModel.getMinutes(data,function(err,result){
				if(!err) minutes = result;
				callback(err,result) 
			});
		})

		async_tasks.push(function(callback){
			noticeModel.getNotices(data,function(err,result){
				if(!err) notices = result;
				callback(err,result);
			});
		});
		
		async.parallel(async_tasks,function(err,result){
			if(err) {
				res.json({
					'success':false,
					'err_msg':'error in getting new counts'
				});	
			}
			else{
				res.json({
					'success':true,
					'notices':notices,
					'circulars':circulars,
					'minutes':minutes
				});
			}
		});
	}
});




module.exports = postDetails;