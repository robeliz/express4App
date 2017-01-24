var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var cookieSession = require('cookie-session'); //Lo cambiamos por express-session para usar redis-connect
var session = require('express-session');
var methodOverride = require('method-override'); // Mediante atributos permite mandar metodos que no estan implementados en navegador put, delete...
var formidable = require('express-formidable'); //Para manejo de archivos
var RedisStore = require('connect-redis')(session); //Como argumento recibe el handler de la session

/*Middlewares*/
var session_middleware = require('./middlewares/session');

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));//Como parametro recibe el nombre del atributo que usaremos para enviar el método


var sessionMiddlewareRedis = session({
	store: new RedisStore({}),//Aqui van las opciones pass, port, etc..
	secret: "aupa_aleti_cagon_to",//Para que las comunicaciones vayan encriptadas
	//resave: true,
	//saveUninitialized: true,
});


app.use(sessionMiddlewareRedis);
app.use(cookieParser());


app.use(formidable({ //Se puede especificar el dir tmp pero por defecto usa la del so
	keepExtensions: true, //Mantiene las extensiones de los archivos subidos al pasarlos del tmp al dir definitivo
}));

/*View engine setup*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

/*Routes*/
var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', session_middleware);
app.use('/users', users);

//TODO: Mirar mas adelante el pq del error de las cabeceras dos veces
//catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(err);
  next(err);
});*/

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.render('error');
});*/


module.exports = app;
