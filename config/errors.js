var HashMap = require('hashmap');
var hmap = new HashMap();

//mapping different types of error to their error codes
hmap.set(0,'success');

hmap.set(1,'user does not exists');

hmap.set(2,'invalid credentials');

hmap.set(3,'token expired . Login Again');




















module.exports = hmap;