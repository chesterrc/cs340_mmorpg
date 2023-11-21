// App.js
// controller to get, update, delete, or push data in myql database 
/*
    SETUP
*/
//express
var express = require('express');   // We are using the express library for the web server
var bodyParser = require('body-parser');

var app     = express();            
PORT        = 5118;              
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
        res.render('index', {style: 'index.css'})             // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                      
/* ***********************************
    sytle sheets aren't accesible for all pages
    -got to figure out how to incorporate styles to each one
*/

/*
Player Page
*/
app.get('/players-page', function(req, res)
    {   
        //console.log('functions is passed through') //for debugging
        let query_player = "SELECT * FROM Players;";
        db.pool.query(query_player, function(error, rows, fields){
            res.render('PlayerPage', {data: rows, style:'players.css'});
        })  
    });

/*
Inventory Page
*/
app.get('/invts-page', function(req, res)
    {
        let query_invts = "SELECT * FROM Inventory;";
        db.pool.query(query_invts, function(error, rows, fields){
            res.render('InventoryPage', {data: rows, style: 'inventory.css'});
        })  
    });

/*
Items Page
*/
app.get('/items-page', function(req, res)
    {
        let query_items = "SELECT * FROM Items;";
        db.pool.query(query_items, function(error, rows, fields){
            res.render('ItemsPage', {data: rows, style: 'items.css'});
        })  
    });

/*
monsters Page
*/
app.get('/monsters-page', function(req, res)
    {
        let query_monsters = "SELECT * FROM Monsters;";
        db.pool.query(query_monsters, function(error, rows, fields){
            console.log({data: rows})// debugging
            res.render('MonsterPage', {data: rows, style:'monster.css'});
        })  
    });

/*
Regions Page
*/
app.get('/regions-page', function(req, res)
    {
        let query_regions = "SELECT * FROM Regions;";
        db.pool.query(query_regions, function(error, rows, fields){
            console.log({data: rows});
            res.render('RegionsPage', {data: rows, style: 'regions.css'});
        })  
    });

/* POSTING FUNCTIONS  */
//add players 
app.post('/add-player-ajax', function(req, res)
{
    //capture the incoming data and parse it back to JS object
    let data = req.body;
    //console.log(data)
    //Create the query and run it on the database
    query1 = 'INSERT INTO Players (char_name, char_xp, char_lvl, regions_rg_id)'
    db.pool.query(query1, function(error, rows, fields){
        //check for errors
        if (error){
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //if there was no error, perform a SELECT *
            query2 = "SELECT * FROM Players";
            db.pool.query(query2, function(error, rows, fields){
                if (error){
                    //check for error
                    console.log(error);
                    res.sendStatues(400);
                }
                else
                {
                    res.send(rows);
                }
            }
            )
        }
    })
});

//add item
app.post('/add-item-ajax', function(req, res) 
{   
    let data = req.body;
    console.log("passed")
    console.log(req);
    console.log(data);
    //console.log(data.item_name, data.regions_rg_id);
    // Create the query and run it on the database
    query1 = `INSERT INTO Items (item_name, regions_rg_id) VALUES ('${data.item_name}', '${data.regions_rg_id}')`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * 
            query2 = `SELECT * FROM Items;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});