var HashMap = require('hashmap');
var hmap = new HashMap();


//Each controller contails a file named authorization.js 
//This file sets the auth ids to which the particular request is authorized
//Foreach request set the array of auth_ids
//if the request is available for all auth_ids just leave the array empty

hmap.set('/',[]);

module.exports = hmap;