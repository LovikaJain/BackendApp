var mySql = require('mysql');
var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server();
var bearerSimple = require('hapi-auth-bearer-simple');
var Routes = require('./Route/route');

// Database connection
var connection = mySql.createConnection({
    host     : 'WP12980935.SERVER-HE.DE',
    user     : 'db12980935-node',
    password : 'Test4DharmaLabs',
    database : 'db12980935-node',
  });

  // Server connectivity
server.connection({
    host: 'localhost',
    port: 8080
});


server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
});

connection.connect(function(err){
    if(err){
        console.error('error connecting: '+ err.stack);
        return;
    }
    console.log('connected as id' + connection.threadId);
});

/*
---------------
Authentication
---------------
*/
server.register(bearerSimple, function(err){
    if(err){
        console.log("Failed to log the plugin",err);
        throw err;
    }
var validateFunction = function (token, callback) {
    
        // Use a real strategy here to check if the token is valid
        if (token === 'abc') {
            callback(null, true, data);
            data.scope = 'user';
        }
        else {
            callback(null, false, data);
        }
    };

server.auth.strategy('bearer', 'bearerAuth', {
    validateFunction: validateFunction
});
server.route(Routes);
})

