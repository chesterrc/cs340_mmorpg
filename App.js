// App.js
// controller to get, update, delete, or push data in myql database 
/*
    SETUP
*/
//express
var express = require('express');   // We are using the express library for the web server

var app     = express();            
PORT        = 5118;              
//handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');                 

//register css files for use in express
app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
Items Page
*/
app.get('/items-page', function(req, res)
    {
        let query_items = "SELECT * FROM Items;";
        let query_regions = "SELECT * FROM Regions;";
        let rgs
        let itm
        db.pool.query(query_items, function(error, rows, fields){
            itm = rows
            console.log(itm)
        }) 
        db.pool.query(query_regions, function(error, rows, fields){
            rgs = rows;
        }) 
        console.log(itm, rgs)
        res.render('ItemsPage', {items: itm, regions: rgs, style: 'items.css'});

    });

/*
monsters Page
*/
app.get('/monsters-page', function(req, res)
    {
        let query_monsters = "SELECT * FROM Monsters;";
        db.pool.query(query_monsters, function(error, rows, fields){
            //console.log({data: rows})// debugging
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
            //console.log({data: rows});
            res.render('RegionsPage', {data: rows, style: 'regions.css'});
        })  
    });

/* 
Player has Monsters Page 
*/
app.get('/PlayerMonster-page', function(req, res)
    {
        let query_regions = "SELECT * FROM Players_has_monsters;";
        db.pool.query(query_regions, function(error, rows, fields){
            //console.log({data: rows});
            res.render('PlayerMonsterPage', {data: rows, style: 'playermonster.css'});
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
                    res.render('ItemsPage', {data: rows, style: 'items.css'});
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
    //console.log(req);
    console.log(data);
    console.log(data.item)
    //console.log(data.item_name, data.regions_rg_id);
    // Create the query and run it on the database
    query1 = `INSERT INTO Items (item_name, regions_rg_id) VALUES ('${data.item}', '${data.rg}')`;
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

/* DELETE ROUTES */
app.delete('/delete-item-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
    let itemID = parseInt(data.id);
    console.log(itemID)
    let delete_item_from_invent = `DELETE FROM Inventory WHERE items_item_id = ?`;
    let delete_item = `DELETE FROM Items WHERE item_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(delete_item, [itemID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(delete_item_from_invent, [itemID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});