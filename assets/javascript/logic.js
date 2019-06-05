var firebaseConfig = {
    apiKey: "AIzaSyAhpDfx1uP5n1tzBrVRgLx78XUxDpakA44",
    authDomain: "fire-training-72651.firebaseapp.com",
    databaseURL: "https://fire-training-72651.firebaseio.com",
    projectId: "fire-training-72651",
    storageBucket: "fire-training-72651.appspot.com",
    messagingSenderId: "277492199121",
    appId: "1:277492199121:web:00cd387054dbf721"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTime = "";
var frequency = "";

$("#add-train").on("click", function(event){
    event.preventDefault();
    trainName = $("#name-input").val();
    destination = $("#destination-input").val();
    firstTime = $("#time-input").val();
    frequency = $("#frequency-input").val();

    database.ref().push({
        name: trainName,
        destination: destination,
        first_time: firstTime,
        frequency: frequency
    });

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function(snapshot){
    var timeDifference = moment(snapshot.val().first_time, "HH:mm").diff(moment(), "minutes");
    if(timeDifference < 0){
        var differenceAdjusted = Math.floor(timeDifference/snapshot.val().frequency);
        differenceAdjusted *= snapshot.val().frequency;
        timeDifference -= differenceAdjusted;
    } else {
        if(timeDifference > snapshot.val().frequency){
            var differenceAdjusted = Math.floor(timeDifference/snapshot.val().frequency);
            differenceAdjusted *= snapshot.val().frequency;
            timeDifference -= differenceAdjusted;
        }
    }

    var newTrain = $("<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + moment().add(timeDifference, "m").format("hh:mm A") + "</td><td>" + timeDifference + "</td></tr>");
    $("tbody").append(newTrain);
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});