var express = require('express');
var router = express.Router();
var User = require("../models/users").User;

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("Por aqui que voy");
	res.render('index', {
		title : 'My Express'
	});
});
/* GET login page. */
router.get('/login', function(req, res, next) {
	/*User.find(function(err, doc){
		//console.log(doc); //--> Mostraria todos los usuarios por consola.
	});*/
	
	res.render("login", {
		title : 'Login',
		error : "",
	});
});
/* GET singup page. */
router.get('/signup', function(req, res, next) {
	res.render("signup", {
		title : 'SignUp',
		existErrors: false,
	});
});

/* POST register page. */
router.post('/register', function(req, res, next) {
	var user = new User({
		email : req.fields.email,
		password : req.fields.password,
		password_confirmation : req.fields.password_confirmation,
		username : req.fields.username
	});
	
	// Uso de promises de ES6
	user.save().then(function(us) {
		return res.send("Tu usuario se ha guardado con éxito"); //Colocado return
		console.log("Usuario creado: ");
		console.log(us);
	}, function(err) {
		//TODO: El manejo de errores no va bien, si el curso no lo trata investigar.
		console.log("ERROR GUARDANDO USUARIO");
		var errors =[];
		for (var errName in err.errors){
			console.log(errName);
			let error = {
					name:null,
					msg:null
			}
			error.name= errName;
			error.msg= err.errors[errName].message;
			errors.push(error);
			console.log(errors);
		}
		res.render("signup",{title:'Registrarse',errors:errors,existErrors: true})
	});

	// Uso de funciones mongoose
	/*
	 * user.save(function(err,user,numeroFilas){ if(err){ res.render("login",
	 * {title:'Login',err:err}); } console.log("El usuario ha sido guardado");
	 * console.log(user); res.send("Los datos han sido guardados"); });
	 */
});

/* POST sessions page. */
router.post('/sessions', function(req, res, next) {
	console.log("Fields en sessions");
	console.log(req.fields);
	User.findOne({email:req.fields.email,password:req.fields.password},function(err, user){
		if(user === null){
			res.render("login", { 
				title : 'Login',
				error : 'El usuario o la contraseña no son correctos'
			});
		}else{
			console.log("Esto es el user devuelto");
			console.log(user);
			console.log("Esto es el req");
			console.log(req);
			console.log(req.session);
			req.session.user_id = user._id;
			res.redirect("/users");  
		}
	});
});

module.exports = router;
