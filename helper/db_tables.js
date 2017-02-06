var HashMap = require('hashmap');
var hmap = new HashMap();

hmap.set('user_table','users');
hmap.set('user_details_table','user_details');
hmap.set('user_other_details_table','user_other_details');
hmap.set('user_address_table','user_address');

hmap.set('employee_basic_details_table','emp_basic_details');
hmap.set('employee_education_details_table','emp_education_details');
hmap.set('employee_family_details_table','emp_family_details');
hmap.set('employee_last_5_year_stay_table','emp_last5yrstay_details');
hmap.set('employee_pay_details_table','emp_pay_details');
hmap.set('employee_prev_exp_details_table','emp_prev_exp_details');
hmap.set('faculty_details_table','faculty_details');	

hmap.set('student_academic_details_table','stu_academic');
hmap.set('student_details_table','stu_details');
hmap.set('student_fee_details_table','stu_admn_fee');
hmap.set('student_other_details_table','stu_other_details');
hmap.set('student_education_details_table','stu_prev_education');

hmap.set('department_table','departments');
hmap.set('course_table','cs_courses');
hmap.set('branch_table','cs_branches');
hmap.set('dept_course_table','dept_course');
hmap.set('course_structure_table','course_structure');
hmap.set('elective_group_table','elective_group');
hmap.set('course_branch_table','course_branch');
hmap.set('optional_offered_table','optional_offered');
hmap.set('honour_minor_offered_table','honour_minor_offered');
hmap.set('minor_offered_table','minor_offered');
hmap.set('subject_table','subjects');

hmap.set('reg_regular_form_table','reg_regular_form');
hmap.set('reg_regular_elective_opted_table','reg_regular_elective_opted');
hmap.set('subject_mapping_table','subject_mapping');
hmap.set('subject_mapping_des_table','subject_mapping_des');

hmap.set('absent_table','absent_table');
hmap.set('total_class_table','total_class_table');
hmap.set('class_engaged_table','class_engaged');
hmap.set('syllabus_table','cs_syllabus');

hmap.set('session_track_table','session_track');
hmap.set('honour_minor_table','hm_form');
hmap.set('honour_minor_details_table','hm_minor_details');
hmap.set('student_section_data_table','stu_section_data');
hmap.set('reg_other_subjects_table','reg_other_subject');
hmap.set('reg_other_form_table','reg_other_form');
hmap.set('attendance_remark_table','attendance_remark_table')

module.exports = hmap;