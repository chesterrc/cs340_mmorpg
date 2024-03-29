// App.js
// controller to get, update, delete, or push data in myql database 
/*
    SETUP
*/

//express
var express = require('express');   // We are using the express library for the web server

var app     = express();            
PORT        = 5115;              
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
            query_monsters = "SELECT * FROM Monsters;";
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

            res.render('RegionsPage', {data: rows, style: 'regions.css'});
        })  
    });

/* 
Player has Monsters Page 
*/
app.get('/PlayerMonster-page', function(req, res)
    {   
        let query_kills;
        let query_players = 'SELECT user_id, char_name FROM Players;'
        let query_monsters = 'SELECT monster_id, monster_name FROM Monsters;'
        if (req.query.player_name === undefined || req.query.player_name === ''){
            query_kills = "SELECT players_user_id, monsters_monster_id, monster_kill_count, xp_gained, char_name, monster_name " +
                        "FROM Players_has_monsters " +
                        "INNER JOIN Players ON Players_has_monsters.players_user_id = Players.user_id " +
                        "INNER JOIN Monsters ON Players_has_monsters.monsters_monster_id = Monsters.monster_id;";
        } else{

            query_kills = `SELECT * FROM Players_has_monsters ` +
            "INNER JOIN Players ON Players_has_monsters.players_user_id = Players.user_id " +
            "INNER JOIN Monsters ON Players_has_monsters.monsters_monster_id = Monsters.monster_id " +
            `where char_name = "${req.query.player_name}";`;
        }
        db.pool.query(query_kills, function(error, rows, fields){
            let kills = rows;
            
            db.pool.query(query_players, function(error, rows, fields){
                let players = rows;

                db.pool.query(query_monsters, function(error, rows, fields){
                    res.render('PlayerMonsterPage', {data: kills, char: players, mon: rows, style: 'playermonster.css'});
                })
            })
        })  
    });

//Player has item's page    
app.get('/PlayerItem-page', function(req, res)
        { 
            let query_playeritem;
            let query_players = 'SELECT user_id, char_name FROM Players;'
            let query_items = 'SELECT item_id, item_name  FROM Items;'
            if (req.query.player_name === undefined || req.query.player_name === ''){
                query_playeritem = "SELECT count, Player_has_item.user_id, Player_has_item.item_id, char_name, item_name " +
                            "FROM Player_has_item " +
                            "INNER JOIN Players ON Player_has_item.user_id = Players.user_id " +
                            "INNER JOIN Items ON Player_has_item.item_id = Items.item_id;";
            } else{
    
                query_playeritem = `SELECT * FROM Player_has_item ` +
                "INNER JOIN Players ON Player_has_item.user_id = Players.user_id " +
                "INNER JOIN Items ON Player_has_item.item_id = Items.item_id " +
                `WHERE char_name = '${req.query.player_name}';`;
            }
            db.pool.query(query_playeritem, function(error, rows, fields){
                let playeritem = rows;
                db.pool.query(query_players, function(error, rows, fields){
                    let players = rows;
                    db.pool.query(query_items, function(error, rows, fields){
                        res.render('PlayerItemPage', {data: playeritem, char: players, itm: rows, style: 'playeritem.css'});
                    })
                })
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
                    res.status(200).send(rows);
                    
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
                    res.status(200).send(rows);
                    
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
                    //console.log('all good');
                    res.status(200).send(rows);
                    
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
                    res.status(200).send(rows);
                    
                }
            })
        }
    })
});

//add player to monster kills
app.post('/add-kills-ajax', function(req, res) 
{   
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Players_has_monsters (players_user_id, monsters_monster_id, monster_kill_count, xp_gained) VALUES ('${data.user}', '${data.mon_id}', '${data.kills}', '${data.xp}')`;
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
            query_kills = "SELECT players_user_id, monsters_monster_id, monster_kill_count, xp_gained, char_name, monster_name " +
                        "FROM Players_has_monsters " +
                        "INNER JOIN Players ON Players_has_monsters.players_user_id = Players.user_id " +
                        "INNER JOIN Monsters ON Players_has_monsters.monsters_monster_id = Monsters.monster_id;";
            db.pool.query(query_kills, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                    
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.status(200).send(rows);
                    
                }
            })
        }
    })
});

//add player item
app.post('/add-playeritem-ajax', function(req, res)
{   
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO Player_has_item (user_id, item_id) VALUES ('${data.user}', '${data.itm}')`;
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
        query_playeritem = "SELECT count, Player_has_item.user_id, Player_has_item.item_id, char_name, item_name " +
        "FROM Player_has_item " +
        "INNER JOIN Players ON Player_has_item.user_id = Players.user_id " +
        "INNER JOIN Items ON Player_has_item.item_id = Items.item_id;";
        db.pool.query(query_playeritem, function(error, rows, fields){

        // If there was an error on the second query, send a 400
        if (error) {
            
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            
        }
        // If all went well, send the results of the query back.
        else
        {
            res.status(200).send(rows);
            
        }
            })
        }
    })
});


/* DELETE ROUTES */

//delete player
app.delete('/delete-player-ajax', function(req,res,next){
    let data = req.body;
    let userID = parseInt(data.id);
    //console.log(monsterID); debug
    let delete_item = `DELETE FROM Players WHERE user_id = ?`;
          // Run the 1st query
          db.pool.query(delete_item, [userID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              
              } else{
                res.sendStatus(200);
              }

})});


//delete item
app.delete('/delete-item-ajax', function(req,res,next){
    let data = req.body;
    let itemID = parseInt(data.id);
    let delete_item = `DELETE FROM Items WHERE item_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(delete_item, [itemID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              
              } else {
                res.sendStatus(200);
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
              res.sendStatus(400);
              
              } else {
                res.sendStatus(200);
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
              res.sendStatus(400);
              
              } else {
                res.sendStatus(200);
              }

  })});
  //Player has monsters
  app.delete('/delete-kills-ajax', function(req,res,next){
    let data = req.body;
  
    let userID = parseInt(data.user_id);
    let monsterID = parseInt(data.monster_id);

    let delete_item = `DELETE FROM Players_has_monsters WHERE players_user_id = ? AND monsters_monster_id = ?;`;
  
          // Run the 1st query
          db.pool.query(delete_item, [userID, monsterID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              
              } else {
                res.sendStatus(200);
              }

  })});

  //delete player has item
  app.delete('/delete-playeritem-ajax', function(req,res,next){
    let data = req.body;

    let rowID = parseInt(data.row);

    let delete_item = `DELETE FROM Player_has_item WHERE count = ?;`;
  
          // Run the 1st query
          db.pool.query(delete_item, [rowID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              
              } else {
                res.sendStatus(200);
              }

  })});


/*
UPDATE FUNCTIONS
*/ 
//player
app.put('/put-player-ajax', function(req,res,next){
    let data = req.body;
  
    let char = parseInt(data.user);
    let xp = parseInt(data.exp);
    let level = parseInt(data.level);
    let itemcount = parseInt(data.itemcount);
    let region = parseInt(data.region);
    //console.log(data); debugging 
    let queryUpdatepplayer = `UPDATE Players SET char_xp = ?, char_lvl = ?, char_inventory_items = ?, regions_rg_id = ? WHERE user_id = ?;`;
    let selectrg = `SELECT * FROM Players WHERE user_id = ?;`
  
          // Run the 1st query
          db.pool.query(queryUpdatepplayer, [xp, level, itemcount, region, char], function(error, rows, fields){
              if (error) {
  
              // Log the error 
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run  second query and return data to frontend
              else
              {
                  // Run the second query
                  db.pool.query(selectrg, [char], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.status(200).send(rows);
                      }
                  })
              }
  })});

//items
app.put('/put-item-ajax', function(req,res,next){
    let data = req.body;
  
    let item = parseInt(data.itemname);
    let region = parseInt(data.region);
    //console.log(data);
    let queryUpdateItem = `UPDATE Items SET regions_rg_id = ? WHERE item_id = ?;`;
    let selectrg = `SELECT * FROM Items WHERE item_id = ?;`
  
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
                  db.pool.query(selectrg, [item], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.status(200).send(rows);
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
    let queryUpdatemonster = `UPDATE Monsters SET regions_rg_id = ? WHERE monster_id = ?;`;
    let selectrg = `SELECT * FROM Monsters WHERE monster_id = ?;`
  
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
                  db.pool.query(selectrg, [monster], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.status(200).send(rows);
                      }
                  })
              }
  })});

  
//regions
app.put('/put-region-ajax', function(req,res,next){
    let data = req.body;
  
    let oldrg = parseInt(data.oldregion);
    let newrg = data.newregion;
    console.log('backend', data);
    let queryUpdateregion = `UPDATE Regions SET rg_name = ? WHERE rg_id = ?;`;
    let selectRegions = 'SELECT * FROM Regions WHERE rg_id = ?'    
    // Run query
        db.pool.query(queryUpdateregion, [newrg, oldrg], function(error, rows, fields){
            if (error) {

            // Log the error 
            console.log(error);
            res.sendStatus(400);
            } else {
                db.pool.query(selectRegions, [oldrg], function(error, rows, fields){
                    if (error){
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        console.log(rows)
                        res.status(200).send(rows);
                    }
                })
            }
  })});


//kills
app.put('/put-kills-ajax', function(req,res,next){
    let data = req.body;
  
    let char = parseInt(data.character);
    let monst = parseInt(data.monster);
    let kills = parseInt(data.kills);
    let xp = parseInt(data.xps);

    let queryUpdateItem = `UPDATE Players_has_monsters SET monsters_monster_id = ?, monster_kill_count = ?, xp_gained = ? WHERE players_user_id = ?;`;
    let query_kills = "SELECT players_user_id, monsters_monster_id, monster_kill_count, xp_gained, char_name, monster_name " +
                        "FROM Players_has_monsters " +
                        "INNER JOIN Players ON Players_has_monsters.players_user_id = Players.user_id " +
                        "INNER JOIN Monsters ON Players_has_monsters.monsters_monster_id = Monsters.monster_id "+
                        "WHERE user_id = ? AND monster_id = ?;";
  
          // Run the 1st query
          db.pool.query(queryUpdateItem, [monst, kills, xp, char], function(error, rows, fields){
              if (error) {
  
              // Log the error 
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run  second query and return data to frontend
              else
              {
                  // Run the second query
                  db.pool.query(query_kills, [char, monst], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.status(200).send(rows);
                      }
                  })
              }
  })});

//player item
app.put('/put-playeritem-ajax', function(req,res,next){
    let data = req.body;

    let row = parseInt(data.count);
    let item = parseInt(data.itm);

    let queryUpdateItem = `UPDATE Player_has_item SET item_id = ? WHERE count = ?;`;
    let  query_playeritem = "SELECT count, Player_has_item.user_id, Player_has_item.item_id, char_name, item_name " +
                            "FROM Player_has_item " +
                            "INNER JOIN Players ON Player_has_item.user_id = Players.user_id " +
                            "INNER JOIN Items ON Player_has_item.item_id = Items.item_id "+
                            "WHERE count = ?;";

            // Run the 1st query
            db.pool.query(queryUpdateItem, [item, row], function(error, rows, fields){
                if (error) {

                // Log the error 
                console.log(error);
                res.sendStatus(400);
                }

                // If there was no error, we run  second query and return data to frontend
                else
                {
                    // Run the second query
                    db.pool.query(query_playeritem, [row], function(error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.status(200).send(rows);
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
