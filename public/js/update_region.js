// Get the objects we need to modify
let updateRegionForm = document.getElementById('update-region-form-ajax');

// Modify the objects we need
updateRegionForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputItemName = document.getElementById("mySelect-item_name");
    let inputrg = document.getElementById("input-region-update");

    // Get the values from the form fields
    let ItemName = inputItemName.value;
    let rg = inputrg.value;

    // abort if being bassed NULL

    if (isNaN(rg)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        itemname: ItemName,
        region: rg,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-item-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, personID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("items-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
