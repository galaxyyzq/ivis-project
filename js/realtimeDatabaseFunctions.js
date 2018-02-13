// API: reference https://firebase.google.com/docs/reference/js/firebase.database.Reference#set

// Get a reference to the database
var database = firebase.database();

function uploadData(data, from, to) {
    // Only take a portion of the data. Starting at "from" and ending at "to".
    console.log(data.slice(from,to));

    // Creates entries in the database. Each entry in data creates a new parent node.
    database.ref().set(data.slice(from,to));

    // Print when done
    console.log("Uploaded",to-from,"files");
}

