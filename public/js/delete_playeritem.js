function deletePlayerItem(row_count) {
    // Put our data we want to send in a javascript object
    let data = {
        row: row_count
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-playeritem-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            deleteRow(row_count);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(count){
    //console.log("Attempting to delete players_user_id:", players_user_id); // For debugging
    let table = document.getElementById("playeritem-tables");
    if (!table) {
        console.log("Table not found!"); // For debugging
        return;
    }
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute("data-value") == count) {
            //console.log("Deleting row:", row); // For debugging
            table.deleteRow(i);
            deleteDropDownMenu(count);
            return;
        }
    }
    console.log("No row found with the provided"); // For debugging
}

function deleteDropDownMenu(count){
    let selectMenu = document.getElementById("mySelect-row");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(count)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }