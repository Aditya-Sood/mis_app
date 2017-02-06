/*
 *author : Rajat Bajaj
*/


/*
 * This file is used to extract the user data from the token received 
 * on every request.

 *Token eg. eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
 .eyJleHAiOjE0NzgwMTI0MjA1ODksInVzZXIiOnsiaWQi
 OiIyMDEzSkUwMTk0IiwiY3JlYXRlZF9kYXRlIjoiMjAxN
 S0wMy0zMVQyMDo0MjoyMS4wMDBaIiwic2FsdXRhdGlvbi
 I6Im1yIiwiZmlyc3RfbmFtZSI6IlJhamF0IiwibWlkZGxl
 X25hbWUiOiIiLCJsYXN0X25hbWUiOiJCYWphaiIsInNleC
 I6Im0iLCJjYXRlZ29yeSI6IkdlbmVyYWwiLCJkb2IiOiIy
 MDE1LTAzLTMwVDE4OjMwOjAwLjAwMFoiLCJlbWFpbCI6In
 JhamF0YmFqYWo1NkBnbWFpbC5jb20iLCJwaG90b3BhdGgi
 OiJzdHVkZW50LzIwMTNqZTAxOTQvc3R1XzIwMTNqZTAxOT
 RfMjAxNTA0MDEwMjEyMjEuanBnIiwibWFyaXRhbF9zdGF0
 dXMiOiJ1bm1hcnJpZWQiLCJwaHlzaWNhbGx5X2NoYWxsZW
 5nZWQiOiJubyIsImRlcHRfaWQiOiJjc2UiLCJkZXB0X25h
 bWUiOiJDb21wdXRlciBTY2llbmNlIGFuZCBFbmdpbmVlcm
 luZyIsImRlcHRfdHlwIjoiYWNhZGVtaWMiLCJicmFuY2hf
 aWQiOiJjc2UiLCJjb3Vyc2VfaWQiOiJiLnRlY2giLCJzZW
 1lc3RlciI6NCwiYXV0aCI6eyIxIjoic3R1In19fQ
 .Fk8c86m1JEh3vmp-as281WRUELeIe61VBTuGyxCF4xU
 *

 *Token consists of three parts separated by '.'
 *Second part contains the payload(user information encoded using base54)
 *to get actual information , second part is decoded using base64 decoding technique

 *decoded second part of above token :
 {"exp":1478012420589,"user":{"id":"2013JE0194","created_date":"2015-03-31T20:42:21.000Z",
 "salutation":"mr","first_name":"Rajat","middle_name":"","last_name":"Bajaj","sex":"m",
 "category":"General","dob":"2015-03-30T18:30:00.000Z","email":"rajatbajaj56@gmail.com",
 "photopath":"student/2013je0194/stu_2013je0194_20150401021221.jpg","marital_status":"unmarried",
 "physically_challenged":"no","dept_id":"cse","dept_name":"Computer Science and Engineering",
 "dept_typ":"academic","branch_id":"cse","course_id":"b.tech","semester":4,"auth":{"1":"stu"}}
 *

*/

var jwt = require('jwt-simple');

function Session(token,callback){
	this.token = token;
	try {
      var decoded = jwt.decode(token, require('config/secret.js')());
      this.payload = decoded;
  	}catch (err) {
      console.log(err);
      callback(err,{'err_code':'unauthorized access'});
    }
		
}

Session.prototype = {

	getId: function(){
		return this.payload.user.id;
	},

	getSalutation: function(){
		return this.payload.user.salutation;
	},

	getFirstName: function(){
		return this.payload.user.first_name;
	},

	getMiddleName: function(){
		return this.payload.user.middle_name;
	},

	getLastName: function(){
		return this.payload.user.last_name;
	},

	getFirstName: function(){
		return this.payload.user.first_name;
	},

	getSex: function(){
		return this.payload.user.sex;
	},

	getAuthId: function(){
		return this.payload.user.auth['1'];
	},

	getDeptId: function(){
		return this.payload.user.dept_id;
	}


}

module.exports = Session;

