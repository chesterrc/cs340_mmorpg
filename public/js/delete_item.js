function deleteItem(itemID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: itemID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-item-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            deleteRow(itemID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

/*
function deleteRow(itemID){

    let table = document.getElementById("items-tables");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == itemID) {
            table.deleteRow(i);
            break;
       }
    }
}*/
function deleteRow(itemID){
    let table = document.getElementById("items-tables");
    if (!table) {
        //console.log("Table not found!"); // For debugging
        return;
    }
    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log("Checking row:", row.getAttribute("data-value")); // For debugging
        if (row.getAttribute("data-value") == itemID) {
            //console.log("Deleting row:", row); // For debugging
            table.deleteRow(i);
            deleteDropDownMenu(itemID);
            return;
        }
    }
    
}

function deleteDropDownMenu(itemID){
    console.log('in dropdwon delete')
    let selectMenu = document.getElementById("mySelect-item_name");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(itemID)){
        console.log('removing update menu item')
        selectMenu[i].remove();
        break;
      } 
  
    }
  }