function deletePlayer(playerID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: playerID
    };
    //console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            //console.log('about to bust');
            deleteRow(playerID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

/*
function deleteRow(playerID){

    let table = document.getElementById("items-tables");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == playerID) {
            table.deleteRow(i);
            break;
       }
    }
}*/
function deleteRow(playerID){
    console.log("Attempting to delete playerID:", playerID); // For debugging
    let table = document.getElementById("player-table");
    if (!table) {
        console.log("Table not found!"); // For debugging
        return;
    }
    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log("Checking row:", row.getAttribute("data-value")); // For debugging
        if (row.getAttribute("data-value") == playerID) {
            console.log("Deleting row:", row); // For debugging
            table.deleteRow(i);
            return;
        }
    }
    console.log("No row found with the provided playerID:", playerID); // For debugging
}