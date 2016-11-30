var HashMap = require('hashmap');
var hmap = new HashMap();

hmap.set('user_table','users');
hmap.set('user_details_table','user_details');
hmap.set('user_other_details_table','user_other_details');
hmap.set('user_address_table','user_address');
hmap.set('employee_basic_details_table','emp_basic_details');
hmap.set('student_academic_details_table','stu_academic');
hmap.set('student_details_table','stu_details');
hmap.set('student_other_details_table','stu_other_details');
hmap.set('student_education_details_table','stu_education_details');



module.exports = hmap;