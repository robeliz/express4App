var User = require("../models/users").User;

module.exports = function (req, res, next){
	if(!req.session.user_id){
		res.redirect("/login");
	}else{
		User.findById(req.session.user_id, function(err, user){
			if(err){
				console.log(err);
				res.redirect("/login",{
					title : 'Login',
					error : 'El usuario o la contraseña no son correctos'
				});
			}else{
				res.locals = {user:user}
				console.log(res.locals);
				next();
			}
		})
		
	}
};