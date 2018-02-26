var express = require('express');
// var request = require( 'request-promise' );
// var vcapServices = require('vcap_services');
// var jsonfile = require( 'jsonfile' );
var parser = require( 'body-parser' );

const port = 3000;
const hostname = "com.example";

// create app
const app = express();

// Middleware
app.use( parser.json() );
app.use( parser.urlencoded( {
	extended: false
} ) );

// Per-request actions - load up the config
app.use( function( req, res, next ) {
	// Just keep swimming
	next();
} );

// Static for main files
app.use( '/', express.static( 'public' ) );

// backend routes
app.use( '/api', require( './api' ) );

// error handler (must be last)
app.use(function(error, req, res, next) {
	res.statusCode = error.statusCode || 500;
	res.json({ message: error.message });
  });

// Listen
var server = app.listen(port, function(){
    console.log( 'App listening on: ' + port );
});