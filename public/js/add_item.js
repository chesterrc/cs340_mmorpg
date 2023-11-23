// Get the objects we need to modify
let addPersonForm = document.getElementById('add-item-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputitemName = document.getElementById("input-item_name");
    let inputrg = document.getElementById("input-rg");

    // Get the values from the form fields
    let itemName = inputitemName.value;
    let rg_place = inputrg.value;

    // Put our data we want to send in a javascript object
    let data = {
        item: itemName,
        rg: rg_place
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-item-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log('inside state change');
        console.log(xhttp.response);
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log('inside if statement xhttps request sent');

            console.log(xhttp.response);
            // Add the new data to the table
            addRowToTable(xhttp.response);
                
            // Clear the input fields for another transaction
            inputitemName.value = '';
            inputrg.value = '';

            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    console.log(data);
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("items-tables");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1] 
    
    console.log(parsedData); //debuggings
    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let ItemCell = document.createElement("TD");
    let rgCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    ItemCell.innerText = newRow.item_name;
    rgCell.innerText = newRow.rg_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteItem(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(ItemCell);
    row.appendChild(rgCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect-item_name");
    let option = document.createElement("option");
    option.text = newRow.item_name;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}