function deleteRegion(regionID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: regionID
    };
    //console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-region-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //console.log('about to bust');
            deleteRow(regionID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

/*
function deleteRow(regionID){

    let table = document.getElementById("items-tables");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == regionID) {
            table.deleteRow(i);
            break;
       }
    }
}*/
function deleteRow(regionID){
    //console.log("Attempting to delete regionID:", regionID); // For debugging
    let table = document.getElementById("regions-tables");
    if (!table) {
        //console.log("Table not found!"); // For debugging
        return;
    }
    for (let i = 0, row; row = table.rows[i]; i++) {
        //console.log("Checking row:", row.getAttribute("data-value")); // For debugging
        if (row.getAttribute("data-value") == regionID) {
            //console.log("Deleting row:", row); // For debugging
            table.deleteRow(i);
            return;
        }
    }
    //console.log("No row found with the provided regionID:", regionID); // For debugging
}