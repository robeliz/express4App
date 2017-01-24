/**
 * http://usejsdoc.org/
 * Roberto Elizo
 */
var Image = require("../models/images").Image;
var owner_check = require("./image_permission");

module.exports = function (req, res, next){
	Image.findById(req.params.id)
		 .populate("creator")
		 .exec(function(err, img){
			 	console.log(img);
				if(img!==null && owner_check(img,req,res)){
					console.log(img);
					res.locals.image = img;
					next();
				}else{
					res.redirect("/users");
				}
			});
}
