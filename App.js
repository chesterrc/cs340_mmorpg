// App.js
// controller to get, update, delete, or push data in myql database 
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

//register css files for use in express
app.use(express.static('public'));      

// Database
var db = require('./database/db-connector');

/*
    ROUTES
*/
//homepage
app.get('/', function(req, res)
    {
        res.render('index', {sytle: 'index.css'})             // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                      

/*
Player Page
*/
app.get('/players-page', function(req, res)
    {   
        let query_player = "SELECT * FROM Players;";
        db.pool.query(query_player, function(error, rows, fields){
            res.render('PlayerPage', {data: rows}, {syle: 'players.css'});
        })  
    });

/*
Inventory Page
*/
app.get('/invts-page', function(req, res)
    {
        let query_invts = "SELECT * FROM Inventory;";
        db.pool.query(query_invts, function(error, rows, fields){
            res.render('InventoryPage', {data: rows}, {style: 'inventory.css'});
        })  
    });

/*
Items Page
*/
app.get('/items-page', function(req, res)
    {
        let query_items = "SELECT * FROM Items;";
        db.pool.query(query_items, function(error, rows, fields){
            res.render('ItemsPage', {data: rows}, {style: 'items.css'});
        })  
    });

/*
monsters Page
*/
app.get('/monsters-page', function(req, res)
    {
        let query_monsters = "SELECT * FROM Monsters;";
        db.pool.query(query_monsters, function(error, rows, fields){
            res.render('PlayerPage', {data: rows}, {style: 'monster.css'});
        })  
    });

/*
Regions Page
*/
app.get('/regions-page', function(req, res)
    {
        let query_regions = "SELECT * FROM Players;";
        db.pool.query(query_regions, function(error, rows, fields){
            res.render('PlayerPage', {data: rows}, {style: 'regions.css'});
        })  
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});