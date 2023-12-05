// Get the objects we need to modify
let addkillsform = document.getElementById('add-kills-form-ajax');

// Modify the objects we need
addkillsform.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputplayerName = document.getElementById("input_player");
    let monster_id = document.getElementById("input-monster_id");
    let inputkillcount = document.getElementById("input-kills_count");
    let inputxpgained = document.getElementById("input-xp_gained");

    // Get the values from the form fields
    let playername = inputplayerName.value;
    let monster = monster_id.value;
    let killcounts = inputkillcount.value;
    let xpgained = inputxpgained.value;

    // Put our data we want to send in a javascript object
    let data = {
        user: playername,
        mon_id: monster,
        kills: killcounts,
        xp: xpgained,
    }

    //setup logic to check each row so that we don't duplicate kill counts
    data_check(playername, monster);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-kills-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        //console.log('inside state change');
        //console.log(xhttp.response);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          
            // Add the new data to the table
            addRowToTable(xhttp.response);
                
            // Clear the input fields for another transaction
            inputplayerName.value = '';
            monster_id.value = '';
            inputkillcount.value = '';
            inputxpgained.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

//function to check if player and monster connections is arleady in table
function data_check(player, monster){
    let table = document.getElementById("playermonster-tables")
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute('user') == player && table.rows[i].getAttribute('monster') == monster) {
            alert('That player to monster connection is already in the table!')
        }
     }

}

// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("playermonster-tables");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1] 
    // Create a row and 3 cells
    let row = document.createElement("TR");
    let useridCell = document.createElement("TD");
    let monsteridCell = document.createElement("TD");
    let killcountcell = document.createElement("TD");
    let xpcell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data 

    useridCell.innerText = newRow.char_name;
    monsteridCell.innerText = newRow.monster_name;
    killcountcell.innerText = newRow.monster_kill_count;
    xpcell.innerText = newRow.xp_gained;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteKills(newRow.players_user_id, newRow.monsters_monster_id);
    };

    // Add the cells to the row 
    row.appendChild(useridCell);
    row.appendChild(monsteridCell);
    row.appendChild(killcountcell);
    row.appendChild(xpcell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('user', newRow.players_user_id);
    row.setAttribute('monster', newRow.monsters_monster_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
    /* 
    Requires SQL expression so that only the requried people are on it
    //drop-down menu addition
    let selectMenu = document.getElementById("mySelect-players_name");
    let option = document.createElement("option");
    option.text = newRow.item_name;
    option.value = newRow.item_id;
    selectMenu.add(option);
    */
}