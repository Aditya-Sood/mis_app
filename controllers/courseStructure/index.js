/**
 *Rajat Bajaj
**/

//route for setting end points
var courseStructure = require('express').Router();

courseStructure.get('/',function(req,res){
	console.log(req);
	res.json({'hey':'Het'});
}) ;

module.exports = courseStructure;