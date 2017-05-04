/*
*@author rajat bajaj
*/

var menu = require('express').Router();
var Session = require('config/session');


menu.get('/',function(req,res){
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

	menuData(function(err,result){
		if(err){
			res.json({
				'success':false,
				'err_msg':'Error in getting the module details'
			});
		}
		else{
			console.log(result);
			res.json({
				'success':true,
				'modules':result[session.getAuthId()]
			});
		}
	});
});


function specifyModules(callback)
{
	var modules = {};
	modules['stu'] = {};
	modules['emp'] = {};
	modules['deo'] = {};


	/*Defining the home menu */
	/*modules['stu']['Home'] = {'id':'home',
								'sub_modules':{
									
								}	
							}


	modules['emp']['Home'] = {'id':'home',
								'sub_modules':{
									
								}	
							}
							

	modules['deo']['Home'] = {'id':'home',
								'sub_modules':{
								}	
							}												
*/
	/*End of definition of home menu */


/*--------------------------------------------------------------------------------*/

	/* Defining the user details menu */

	modules['stu']['User Details'] = {'id':'user_details',
									   'sub_modules':{'1':'View Details',
													  '2':'Edit Details'}
									 };

	modules['emp']['User Details'] = {'id':'user_details',
									   'sub_modules':{'1':'View Details',
													  '2':'Edit Details'}
									 };
 
 	modules['deo']['User Details'] = {'id':'user_details',
									   'sub_modules':{'1':'View Details',
													  '2':'Edit Details'}
									 };


	/* End of definition of user details menu*/

/*---------------------------------------------------------------------------------------*/

	/* Defining the course Structure menu */

	modules['stu']['Course Structure'] = {'id':'course_structure',
										   'sub_modules':{
										   		'3':'View Course Structure'
										   }
										  };

	modules['emp']['Course Structure'] = {'id':'course_structure',
										   'sub_modules':{
										   		'3':'View Course Structure'
										   }
										  };

    modules['deo']['Course Structure'] = {'id':'course_structure',
										   'sub_modules':{
										   		'3':'View Course Structure'
										   }
										  };

	/* End of definition of course structure menu */


/* --------------------------------------------------------------------------------------*/

	/* Defining the menu for attendance module */

	modules['stu']['Attendance'] = {'id':'attendance',
									'sub_modules':{
										'4':'View Attendance'
										}
									};

	
	modules['emp']['Attendance'] = {'id':'attendance',
									'sub_modules':{
										'4':'View Attendance',
										'5':'Defaulter List'
										}
									};


	/* End of definition of attendance module */


/*---------------------------------------------------------------------------------------*/	
	
	callback(false,modules);
}


function menuData(callback)
{
	modules = {};

	modules['stu'] = {'1':'home',
					  '2':'user_details',
					  '3':'edit_details',
					  '4':'view_details',
					  '5':'course_structure',
					  '6':'view_course_structure',
					  '7':'attendance',
					  '8':'view_attendance',
					  '9':'others',
					  '10':'logout'
					  };

	modules['emp'] = {'1':'home',
					  '2':'user_details',
					  '3':'edit_details',
					  '4':'view_details',
					  '5':'course_structure',
					  '6':'view_course_structure',
					  '7':'attendance',
					  '8':'view_attendance',
					  '9':'view_defaulter_list',
					  '10':'others',
					  '11':'logout'};					  

	modules['deo'] = {'1':'home',
					  '2':'user_details',
					  '3':'edit_details',
					  '4':'view_details',
					  '5':'course_structure',
					  '6':'view_course_structure',
					  '7':'attendance',
					  '8':'view_attendance',
					  '9':'others',
					  '10':'logout'
					  };

	callback(false,modules);
}

module.exports = menu;