var Image = require("../models/images").Image;

module.exports = function(image, req, res){
	//Ver imagen, cualquiera puede verlo
	if(req.method === "GET" && req.path.indexOf("edit") < 0) return true;
	
	if(image.creator._id.toString() == res.locals.user._id) return true;
	
	return false;
}