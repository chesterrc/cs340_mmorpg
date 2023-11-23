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
        console.log('inside state change');
        console.log(xhttp.response);
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log('inside if statement xhttps request sent');

            console.log(xhttp.response);
            // Add the new data to the table
            addRowToTable(xhttp.response);
                
            // Clear the input fields for another transaction
            inputRegionname.value = '';

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
    let currentTable = document.getElementById("regions-tables");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1] 
    console.log(parsedData);
    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let rgCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    rgCell.innerText = newRow.fname;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRegion(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(rgCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}