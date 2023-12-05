function deleteKills(players_user_id, monster_id) {
    // Put our data we want to send in a javascript object
    let data = {
        user_id: players_user_id,
        monster_id: monster_id,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-kills-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //console.log('about to bust');
            deleteRow(players_user_id, monster_id);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

/*
function deleteRow(players_user_id){

    let table = document.getElementById("items-tables");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == players_user_id) {
            table.deleteRow(i);
            break;
       }
    }
}*/
function deleteRow(players_user_id, monster_id){
    //console.log("Attempting to delete players_user_id:", players_user_id); // For debugging
    let table = document.getElementById("playermonster-tables");
    if (!table) {
        console.log("Table not found!"); // For debugging
        return;
    }
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute("user") == players_user_id && row.getAttribute('monster') == monster_id) {
            //console.log("Deleting row:", row); // For debugging
            table.deleteRow(i);
            //deleteDropDownMenu(players_user_id, monster_id);
            return;
        }
    }
    console.log("No row found with the provided players_user_id:", players_user_id); // For debugging
}

function deleteDropDownMenu(players_user_id, monster_id){
    let selectMenu = document.getElementById("mySelect-char_name");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(players_user_id)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }