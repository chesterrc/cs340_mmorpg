// Get the objects we need to modify
let updateKillsForm = document.getElementById('update-kill-form-ajax');

// Modify the objects we need
updateKillsForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputcharname = document.getElementById("mySelect-char_name");
    let inputmonstername = document.getElementById("input-monster-update");
    let inputkillcount = document.getElementById("update-kills_count");
    let inputxpgained = document.getElementById("update-xp_gained");

    // Get the values from the form fields
    let charname = inputcharname.value;
    let monstername = inputmonstername.value;
    let killcount = inputkillcount.value;
    let xp = inputxpgained.value;

    // Put our data we want to send in a javascript object
    let data = {
        character: charname,
        monster: monstername,
        kills: killcount,
        xps: xp
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-kills-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, charname, monstername);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, userID, monsterID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("playermonster-tables");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("user") == userID && table.rows[i].getAttribute("monster") == monsterID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
             
            // Reassign to our value we updated to
            
            td1.innerHTML = parsedData[0].monster_name; 
            td2.innerHTML = parsedData[0].monster_kill_count; 
            td3.innerHTML = parsedData[0].xp_gained; 
       }
    }
}
