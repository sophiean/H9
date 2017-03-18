//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("loc_db1", "0.1", "A Database of Locations", 1024 * 1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function(t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS location (id INTEGER PRIMARY KEY ASC, Longitude TEXT, Lattitude TEXT, Location TEXT)");
    });



} else {
    alert("WebSQL is not supported by your browser!");
}

function addLocation() {
    console.log("inside add location");
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var longitude = document.getElementById("longitude").value;
        var lattitude = document.getElementById("latitude").value;
        var location = document.getElementById("location").value;
        

        //Test to ensure that the user has entered both a make and model
        if (longitude !== "" && lattitude !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function(t) {
                t.executeSql("INSERT INTO location (Longitude, Lattitude, Location) VALUES (?, ?, ?)", [longitude, lattitude, location]);
                outputLocations();
            });
        } else {
            alert("You must enter a Longitude and Latitude!");
        }
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

//function to output the list of cars in the database

function updateLocationsList(transaction, results) {
    console.log("inside update location list");
		console.log(transaction);
    console.log(results);
    //initialise the listitems variable
    var listitems = "";
    //get the car list holder ul
    var listholder = document.getElementById("loclist");

    //clear cars list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);
        listholder.innerHTML += "<li>" + row.Longitude + " : " + row.Lattitude + " : " + row.Location + " (<a href='javascript:void(0);' onclick='deleteLocation(" + row.id + ");'>Delete Place</a>)";

        //listholder.innerHTML += "<li>" + row.longitude + " - " + row.lattitude + " (<a href='javascript:void(0);' onclick='deleteCar(" + row.id + ");'>Delete Car</a>)";
    }

    var counter =0;
    for (var i = 0; i < results.rows.length; i++) {  
        var row = results.rows.item(i);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(row.Longitude,row.Lattitude),
        map: map
      });
      console.log("the latitude is:" +row.Lattitude);
            console.log("the longitude is:" +row.Longitude);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          counter++;
        infowindow.setContent(row.Longitude + " " + row.lattitude  + "  Count:" + counter);
          console.log("logged the click event" + counter);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }

}

//function to get the list of cars from the database

function outputLocations() {
    console.log("inside output location");
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("SELECT * FROM location", [], updateLocationsList);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }

    
}

//function to add the car to the database




//function to remove a car from the database, passed the row id as it's only parameter

function deleteLocation(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("DELETE FROM location WHERE id=?", [id], outputLocations);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}






    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: new google.maps.LatLng(48.462925, -123.311903),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });


  

        var infowindow = new google.maps.InfoWindow();

    

