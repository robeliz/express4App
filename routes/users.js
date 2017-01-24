var express = require('express');
var router = express.Router();
var Image = require("../models/images").Image;
var image_finder_middleware = require("../middlewares/find_image");
var fs = require("fs");

/* GET users listing. */
router.get("/",function(req,res){
    Image.find({}).populate("creator")
    .exec(function(err,images){
        if(err){ 
        	console.log(err) 
        }else{
        	res.render("home",{title:'Bienvenido',images: images})
        }
    });

});

router.get('/imagenes/new',function(req, res){
	res.render('imagenes/new',{title:'Nueva Imagen'});
});

router.all("/imagenes/:id*",image_finder_middleware);

router.get('/imagenes/:id/edit',function(req, res){
	res.render('imagenes/new')
});

//Arquitectura REST
router.route("/imagenes/:id")
	.get(function(req, res){//Solicita
		res.render("imagenes/show");
	})
	.put(function(req, res){//Actualiza
		res.locals.image.title = req.fields.title;
		img = res.locals.image;
		img.save().then(
			function(im){
				res.render("imagenes/show");
			},
			function(err){
				res.response(err);
			}
		)
	})
	.delete(function(req, res){//Lo borra
		/*
		 * Tambien se puede buscar el elemento con findById y luego eliminar lo que
		 * devuelve con image.remove() pero hacemos en dos query lo que con este se
		 * hace en uno. Podría ser válido si antes de eliminar tenemos que hacer algo
		 * con la imagen a eliminar
		 */
		console.log("Delete");
		Image.findOneAndRemove({_id: req.params.id}, function(err){
			if(!err){
				res.redirect("/users/imagenes/");  
			}else{
				res.response(err);
			}
		});
	})

	
//Lo mismo para la coleccion de imagenes
router.route("/imagenes")
	.get(function(req, res){//Solicita
		Image.find({creator: res.locals.user._id},function(err, images){ //Solo las que el usuario ha creado
			if(!err){
				return res.render("imagenes/index",{images:images}); //Colocado return 
			}else{
				return res.render(err);
			}
		});
	})
	.post(function(req, res){//Subida de archivo
		var file = req.files.file;
		var extension = file.name.split(".").pop();
		var data = {
			title: req.fields.title,
			creator: res.locals.user.id,
			extension: extension
		}
		
		var image = new Image(data);
		image.save().then(
				function (im){
					console.log("public/users_images/"+im._id+"."+extension);
					fs.rename(file.path,"public/users_images/"+im._id+"."+extension);
					console.log("La imagen se ha guardado correctamente");
					res.redirect("/users/imagenes/"+im._id);  
				},
				function(err){
					console.log("ERROR AL GUARDAR LA IMAGEN");
					res.render(err);
				})
	})
	

module.exports = router;
