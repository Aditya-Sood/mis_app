var HashMap = require('hashmap');
var hmap = new HashMap();

//empty list signifies for all
hmap.set('/sessionyear',[]);
hmap.set('/semester',[]);
hmap.set('/subjectlist',[]);
hmap.set('/studentattendance',[]);
hmap.set('/subjectattendance',[]);
hmap.set('/subjectmapped',['emp']);
hmap.set('/viewattendancesheet',['emp']);
hmap.set('/subjectattendanceall',['emp']);
hmap.set('/getdefaulterlist',['emp']);

module.exports = hmap;