/**
 * http://usejsdoc.org/
 * Roberto Elizo
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/*
 * DATA TYPE
 * String
 * Number
 * Date
 * Buffer
 * Mixed
 * Objectid
 * Boolean
 * Array
 */

//Con el createConnection ha dejado de funcionar debo poner connect
//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/fotos');
mongoose.connect('mongodb://127.0.0.1:27017/fotos');
//testing connectivity
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully");
});

/*Creamos JSON para usar en el schema
 * Las validaciones de mongoose se hacen a nivel del schema se ejecutan en save y los errores se reciben en la funcion save tambien
 * required, maxlength, minlength, match, min, max, type, enum
 * Para crear nuestras propias validaciones utilizamos validate con un JSON con la funcion que comprueba y el message
 */
var password_validation = {
  	  validator: function (p){
		  console.log("Pass = "+ p +" y confirmation "+ this.password_confirmation);
		  return this.password_confirmation === p;
	  },
	  message: "Los password no son iguales"
  };

var posibles_valores= ["Masculino","Femenino"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Indique un email válido"];

var userSchemaJSON = {
	name: String,
	last_name: String,
	username:{type:String, required:"El campo username es obligatorio", maxlength:[50,"El campo username no puede ser mayor de 50 caracteres"], minlength:[5,"El campo username no puede ser menor de 5 caracteres"]},
	password:{type:String, 
		      required:"El campo password es obligatorio", 
		      minlength:[5,"El password debe contener al menos 5 caracteres"],
		      validate: password_validation
	},
	age:{type: Number, min:[5,"La edad no puede ser menor de 5"], max:[5,"La edad no puede ser mayor de 99"]},
	email:{type:String, required:"El campo email es obligatorio",match:email_match},
	date_of_birth:Date,
	sex:{type:String,enum:{values:posibles_valores, message:"Debe elegir masculino o femenino"} }
};

//Creamos schema
var user_schema = new Schema(userSchemaJSON);

//Creando los virtuals, que son propiedades de colecciones que no se guardan en DB
user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
});

user_schema.virtual("password_confirmation").set(function(password){
	this.p_c = password;
});

user_schema.virtual("full_name").get(function(){
	return this.name+" "+this.last_name;
}).set(function(){
	//TODO: No tiene en cuenta nombres compuestos o el numero de apellido que puede poner
	//pero es un ejemplo de uso.
	var words = this.full_name.split(" ");
	this.name=words[0];
	this.last_name=words[1];
});


//Model crea una coleccion con el plural del primer param , en este caso Users
//Siempre hay que crear un modelo para utilizar la conexion a Mongo DB
var User = mongoose.model("User", user_schema);

module.exports.User = User;
