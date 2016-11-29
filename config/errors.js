var HashMap = require('hashmap');
var hmap = new HashMap();

//mapping different types of error to their error codes
hmap.set(0,'success');

hmap.set(1,'user does not exists');

hmap.set(2,'invalid credentials');

hmap.set(3,'token expired . Login Again');

hmap.set(4,'data consistency error');

hmap.set(5,'sql error');

hmap.set(6,'Error getting data from database');




















module.exports = hmap;