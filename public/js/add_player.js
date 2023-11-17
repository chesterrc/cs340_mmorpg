// Get the objects we need to modify
let addPersonForm = document.getElementById('add-player-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCharName = document.getElementById("input-name");
    let inputxp = document.getElementById("input-xp");
    let inputlvl = document.getElementById("input-lvl");
    let inputrg = document.getElementById("input-rg");

    // Get the values from the form fields
    let charNameValue = inputCharName.value;
    let xpValue = inputxp.value;
    let lvlValue = inputlvl.value;
    let rgValue = inputrg.value;

    // Put our data we want to send in a javascript object
    let data = {
        charname: charNameValue,
        xp: xpValue,
        lvl: lvlValue,
        rg: rgValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCharName.value = '';
            inputxp.value = '';
            inputlvl.value = '';
            inputrg.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("player-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let CharNameCell = document.createElement("TD");
    let lvlCell = document.createElement("TD");
    let rgCell = document.createElement("TD");
    let invtCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.user_id;
    CharNameCell.innerText = newRow.char_name;
    xpCell.innerText = newRow.char_xp;
    lvlCell.innerText = newRow.char_lvl;
    rgCell.innerText = newRow.regions_rg_id;
    invtCell.innerText = newRow.Inventory_inv_id;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(CharNameCell);
    row.appendChild(xpCell);
    row.appendChild(lvlCell);
    row.appendChild(rgCell);
    row.appendChild(invtCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}