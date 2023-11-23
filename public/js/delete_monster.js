function deleteMonster(monsterId) {
    // Put our data we want to send in a javascript object
    let data = {
        id: monsterId
    };
    //console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-monster-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            //console.log('about to bust');
            deleteRow(monsterId);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

/*
function deleteRow(monsterId){

    let table = document.getElementById("items-tables");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == monsterId) {
            table.deleteRow(i);
            break;
       }
    }
}*/
function deleteRow(monsterId){
    console.log("Attempting to delete monsterId:", monsterId); // For debugging
    let table = document.getElementById("monsters-tables");
    if (!table) {
        console.log("Table not found!"); // For debugging
        return;
    }
    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log("Checking row:", row.getAttribute("data-value")); // For debugging
        if (row.getAttribute("data-value") == monsterId) {
            console.log("Deleting row:", row); // For debugging
            table.deleteRow(i);
            return;
        }
    }
    console.log("No row found with the provided monsterId:", monsterId); // For debugging
}