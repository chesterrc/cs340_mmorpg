// Get the objects we need to modify
let updateRegionForm = document.getElementById('update-playeritem-form-ajax');

// Modify the objects we need
updateRegionForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputrow = document.getElementById("mySelect-row");
    let inputitem = document.getElementById("input-item-update");

    // Get the values from the form fields
    let row = inputrow.value;
    let item = inputitem.value;

    // Put our data we want to send in a javascript object
    let data = {
        count: row,
        itm: item,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-playeritem-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, row);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, rowID){
    let parsedData = JSON.parse(data);
 
    let table = document.getElementById("playeritem-tables");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == rowID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign to our value we updated to
            td.innerHTML = parsedData[0].item_name; 
       }
    }
}
