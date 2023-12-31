// Get the objects we need to modify
let addRegionForm = document.getElementById('add-region-form-ajax');

// Modify the objects we need
addRegionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRegionname = document.getElementById("input-region_name");

    // Get the values from the form fields
    let rg_name = inputRegionname.value;

    // Put our data we want to send in a javascript object
    let data = {
        rg: rg_name
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-region-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);
                
            // Clear the input fields for another transaction
            inputRegionname.value = '';

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
    let currentTable = document.getElementById("regions-tables");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1] 
    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let rgCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.rg_id;
    rgCell.innerText = newRow.rg_name;
    

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRegion(newRow.rg_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(rgCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.rg_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    //drop-down menu addition
    let selectMenu = document.getElementById("mySelect-region_name");
    let option = document.createElement("option");
    option.text = newRow.rg_name;
    option.value = newRow.rg_id;
    selectMenu.add(option);
}