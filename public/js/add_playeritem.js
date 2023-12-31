// Get the objects we need to modify
let addRegionForm = document.getElementById('add-playeritem-form-ajax');

// Modify the objects we need
addRegionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let username = document.getElementById("input_player");
    let itemname = document.getElementById("input-item_id");

    // Get the values from the form fields
    let player = username.value;
    let item = itemname.value;

    //check if the player already has an item
    data_check(player, item);

    // Put our data we want to send in a javascript object
    let data = {
        user: player,
        itm: item
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-playeritem-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);
                
            // Clear the input fields for another transaction
            player.value = '';
            item.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


//function to check if player already has an item
function data_check(player, item){
    let table = document.getElementById("playeritem-tables")
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute('user') == player && table.rows[i].getAttribute('item') == item) {
            alert('That player already has an item!')
        }
     }

}

// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("playeritem-tables");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1] 
    // Create a row and 3 cells
    let row = document.createElement("TR");
    let CountCell = document.createElement("TD");
    let useridCell = document.createElement("TD");
    let itemidCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    CountCell.innerText = newRow.count;
    useridCell.innerText = newRow.char_name;
    itemidCell.innerText = newRow.item_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePlayerItem(newRow.count);
    };

    // Add the cells to the row 
    row.appendChild(CountCell);
    row.appendChild(useridCell);
    row.appendChild(itemidCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.count);
    
    // Add the row to the table
    currentTable.appendChild(row);

    //drop-down menu addition
    let selectMenu = document.getElementById("mySelect-row");
    let option = document.createElement("option");
    option.text = newRow.count;
    option.value = newRow.count;
    selectMenu.add(option);
}