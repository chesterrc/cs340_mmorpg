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
        let query_player;
        let query_regions = "SELECT * FROM Regions;";
        console.log(req.query.player_name);
        if (req.query.player_name === undefined || req.query.player_name === ''){
            query_player = "SELECT * FROM Players;";
        }
        else{
            query_player = `SELECT * FROM Players WHERE char_name = "${req.query.player_name}";`;
        }
        db.pool.query(query_player, function(error, rows, fields){
            let players = rows;
            
            db.pool.query(query_regions, function(error, rows, fields){
                    let rgs = rows;
                    res.render('PlayerPage', {data: players, region: rgs, style: 'players.css'});
            }) 
        })  
    });


/*
Items Page
*/
app.get('/items-page', function(req, res)
    {
        let query_items;
        let query_regions = "SELECT * FROM Regions;";
        if (req.query.item_name === undefined || req.query.item_name === ''){
            query_items = "SELECT * FROM Items;";
        }
        else{
            query_items = `SELECT * FROM Items WHERE item_name = "${req.query.item_name}";`;
        }
        db.pool.query(query_items, function(error, rows, fields){
            
            let items = rows;
            
            db.pool.query(query_regions, function(error, rows, fields){
                    let rgs = rows;
                    return res.render('ItemsPage', {data: items, region: rgs, style: 'items.css'});
            }) 
        }) 
    });

/*
monsters Page
*/
app.get('/monsters-page', function(req, res)
    {
        let query_monsters;
        let query_regions = "SELECT * FROM Regions;";
        if (req.query.monster_name === undefined || req.query.monster_name === ''){
            query_monsters = "SELECT * FROM Items;";
        }
        else{
            query_monsters = `SELECT * FROM Monsters WHERE monster_name = "${req.query.monster_name}";`;
        }
        db.pool.query(query_monsters, function(error, rows, fields){
            let monsters = rows;

            db.pool.query(query_regions, function(error, rows, fields){
                let rgs = rows;
                res.render('MonsterPage', {data: monsters, region: rgs, style: 'monster.css'});
            }) 
        })  
    });

/*
Regions Page
*/
app.get('/regions-page', function(req, res)
    {
        let query_regions;
        if (req.query.region === undefined || req.query.region === ''){
            query_regions = "SELECT * FROM Regions;";
        }
        else{
            query_regions = `SELECT * FROM Regions WHERE rg_name = "${req.query.region}";`;
        }
        db.pool.query(query_regions, function(error, rows, fields){
            //console.log({data: rows});
            res.render('RegionsPage', {data: rows, style: 'regions.css'});
        })  
    });

/* 
Player has Monsters Page 
This is incomplete need to add other attributes
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
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Players (char_name, char_xp, char_lvl, char_inventory_items, regions_rg_id) VALUES ('${data.char_name}', '${data.xp_name}', '${data.char_lvl}', '${data.invt_count}', '${data.rg}')`;
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
            query2 = `SELECT * FROM Players;`;
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
                    res.status(204).send(rows);
                    
                }
            })
        }
    })
});

//add item
app.post('/add-item-ajax', function(req, res) 
{   
    let data = req.body;
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
                    res.status(204).send(rows);
                    
                }
            })
        }
    })
});


//add monster
app.post('/add-monster-ajax', function(req, res) 
{   
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Monsters (monster_name, monster_lvl, regions_rg_id) VALUES ('${data.monster_name}', '${data.monster_lvl}', '${data.rg}')`;
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
            query2 = `SELECT * FROM Monsters;`;
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
                    res.status(204).send(rows);
                    
                }
            })
        }
    })
});

//add region
app.post('/add-region-ajax', function(req, res) 
{   
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Regions (rg_name) VALUES ('${data.rg}')`;
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
            query2 = `SELECT * FROM Regions;`;
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
                    res.status(204).send(rows);
                    
                }
            })
        }
    })
});


/* DELETE ROUTES */

//delete player
app.delete('/delete-player-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
    let userID = parseInt(data.id);
    //console.log(monsterID); debug
    let delete_item = `DELETE FROM Players WHERE user_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(delete_item, [userID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(204);
              }

})});


//delete item
app.delete('/delete-item-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
    let itemID = parseInt(data.id);
    console.log(itemID); 
    let delete_item = `DELETE FROM Items WHERE item_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(delete_item, [itemID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(204);
              }

  })});

  //delete monster
app.delete('/delete-monster-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
    let itemID = parseInt(data.id);
    //console.log(monsterID); debug
    let delete_item = `DELETE FROM Monsters WHERE monster_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(delete_item, [itemID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(204);
              }

  })});

//delete Regions
app.delete('/delete-region-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
    let rgID = parseInt(data.id);
    //console.log(monsterID); debug
    let delete_item = `DELETE FROM Regions WHERE rg_id = ?`;
  
          // Run the 1st query
          db.pool.query(delete_item, [rgID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(204);
              }

  })});
  //

/*
UPDATE FUNCTIONS
*/ 

//items
app.put('/put-item-ajax', function(req,res,next){
    let data = req.body;
  
    let item = parseInt(data.itemname);
    let region = parseInt(data.region);
    //console.log(data);
    let queryUpdateItem = `UPDATE Items SET regions_rg_id = ? WHERE item_id = ?`;
    let selectrg = `SELECT * FROM Regions WHERE rg_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateItem, [region, item], function(error, rows, fields){
              if (error) {
  
              // Log the error 
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run  second query and return data to frontend
              else
              {
                  // Run the second query
                  db.pool.query(selectrg, [region], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.status(204).send(rows);
                      }
                  })
              }
  })});

  //monster
  app.put('/put-monster-ajax', function(req,res,next){
    let data = req.body;
  
    let monster = parseInt(data.monster);
    let region = parseInt(data.region);
    //console.log(data);
    let queryUpdatemonster = `UPDATE Monsters regions_rg_id = ? WHERE monster_id = ?`;
    let selectrg = `SELECT * FROM Regions WHERE rg_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdatemonster, [region, monster], function(error, rows, fields){
              if (error) {
  
              // Log the error 
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run  second query and return data to frontend
              else
              {
                  // Run the second query
                  db.pool.query(selectrg, [region], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.status(204).send(rows);
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