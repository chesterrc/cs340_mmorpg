// Get the objects we need to modify
let updateRegionForm = document.getElementById('update-player-form-ajax');

// Modify the objects we need
updateRegionForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlayername = document.getElementById("mySelect-player_name");
    let inputxp = document.getElementById("input-update-xp");
    let inputlvl = document.getElementById("input-update-lvl");
    let inputitmcount = document.getElementById("input-update-itmcount");
    let inputrg = document.getElementById("input-region-update");

    // Get the values from the form fields
    let playername = inputPlayername.value;
    let xp = inputxp.value;
    let lvl = inputlvl.value;
    let itmcount = inputitmcount.value;
    let rg = inputrg.value;

    

    // abort if rg is NULL
    if (isNaN(rg)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        user: playername,
        exp: xp,
        level: lvl,
        itemcount: itmcount,
        region: rg
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, playername);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, playerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("player-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == playerID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td_xp = updateRowIndex.getElementsByTagName("td")[2];
            let td_lvl = updateRowIndex.getElementsByTagName("td")[3];
            let td_itemcount = updateRowIndex.getElementsByTagName("td")[4];
            let td_region = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign to our value we updated to
            td_xp.innerHTML = parsedData[0].char_xp; 
            td_lvl.innerHTML = parsedData[0].char_lvl; 
            td_itemcount.innerHTML = parsedData[0].char_inventory_items; 
            td_region.innerHTML = parsedData[0].regions_rg_id;  
       }
    }
}
