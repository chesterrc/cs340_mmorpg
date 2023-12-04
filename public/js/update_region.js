// Get the objects we need to modify
let updateRegionForm = document.getElementById('update-region-form-ajax');

// Modify the objects we need
updateRegionForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputrgName = document.getElementById("mySelect-region_name");
    let newrgname = document.getElementById("input-update-region_name");

    // Get the values from the form fields
    let oldrg = inputrgName.value;
    let newrg = newrgname.value;

    // Put our data we want to send in a javascript object
    let data = {
        oldregion: oldrg,
        newregion: newrg,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-region-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, oldrg);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, regionID){
    let parsedData = JSON.parse(data);
    console.log('using rg_name', parsedData[0].rg_name);


 
    let table = document.getElementById("regions-tables");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == regionID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign to our value we updated to
            td.innerHTML = parsedData[0].rg_name; 
       }
    }
}
