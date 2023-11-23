// Get the objects we need to modify
let addPersonForm = document.getElementById('add-player-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputcharName = document.getElementById("input-char_name");
    let inputxpname = document.getElementById("input-xp");
    let inputcharlvl = document.getElementById("input-level");
    let inputinvt_count = document.getElementById("input-invt_count");
    let inputrg = document.getElementById("input-rg");

    // Get the values from the form fields
    let charName = inputcharName.value;
    let xpname = inputxpname.value;
    let charlvl = inputcharlvl.value;
    let invt_count = inputinvt_count.value;
    let rg_place = inputrg.value;

    // Put our data we want to send in a javascript object
    let data = {
        char_name: charName,
        xp_name: xpname,
        char_lvl: charlvl,
        invt_count: invt_count,
        rg: rg_place
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-ajax", true);
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
            inputcharName.value = '';
            inputxpName.value = '';
            inputcharlvl.value = '';
            inputinvt_count.value = '';
            inputrg.value = '';

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
    let currentTable = document.getElementById("player-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1] 
    console.log(parsedData);
    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let char_nameCell = document.createElement("TD");
    let xp_nameCell = document.createElement("TD");
    let char_lvlCell = document.createElement("TD");
    let rgCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    char_nameCell.innerText = newRow.fname;
    xp_nameCell.innerText = newRow.fname;
    char_lvlCell.innerText = newRow.fname;
    rgCell.innerText = newRow.lname;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(char_nameCell);
    row.appendChild(xp_nameCell);
    row.appendChild(char_lvlCell);
    row.appendChild(rgCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}