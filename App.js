// App.js

/*
    SETUP
*/
//express
var express = require('express');   // We are using the express library for the web server
var app     = express();            
PORT        = 5116;              
//handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');                 

// app.js

// Database
var db = require('./database/db-connector')

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        let query_player = "SELECT * FROM Players;";
        db.pool.query(query_player, function(error, rows, fields){
            res.render('index', {data: rows});
        })                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});