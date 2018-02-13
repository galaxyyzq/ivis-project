var firestore = firebase.firestore();

//  Cloud Firestore is optimized for storing large collections of small documents!

// collection/document/collection/document.... and so forth
// A collection holds many documents
const docRef = firestore.doc("countries/sweden");

function testSave(cb) {
    docRef.set({
        population: 12
    }).then(function () {
        cb("Data Saved!");
    }).catch(function (err) {
        cb("Got and error", err);
    })
}

function testSave2(cb) {
    // Adds a user collection with a document that has a random ID
    // That document contains the fields added.
    for (i = 0; i < 10; i++) {
        firestore.collection("users").add({
            first: "Per",
            last: "Olsson"
        })
    }
    cb();
}

function getDataFromYear(year, cb) {
    let users = [];
    firestore.collection(year).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        cb(users);
    });
}

// This is not possible, takes way to long time
function find(data, year) {
    let res = [];
    data.forEach(function(d) {
        if(d.Year == year){
            res.push(d);
            console.log("yes");
        } else {
            console.log("no");
        }
    });
    return res;
}

// async function uploadData(data) {
//     data.forEach(function(d){
//         await upload(d);
//     })
// }

// // Uploads all data entries to firebase. Takes a really long time
// function upload(data) {
//     // Have to wait for each entry, otherwise it will freeze.
//     return firestore
//         .collection(val.Year).add(val)
//         .then(function () {
//             console.log("saved");
//         }).catch(function (error) {
//             console.log(error);
//         });
// }   