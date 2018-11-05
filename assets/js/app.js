$(document).ready(function() {

var config = {
  apiKey: "AIzaSyAnsdviwDD3zpt5TukmvNmKzBbveUMWbLA",
  authDomain: "bootcamp-01.firebaseapp.com",
  databaseURL: "https://bootcamp-01.firebaseio.com",
  projectId: "bootcamp-01",
  storageBucket: "bootcamp-01.appspot.com",
  messagingSenderId: "420697023056"
};
firebase.initializeApp(config);

var database = firebase.database();


$("#add-trainsched-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#trainsched-name-input").val().trim();
  var destination = $("#dest-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();


  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads trainsched data to the database
  database.ref("train/schedules").push(newTrain);

  // Clears all of the text-boxes
  $("#trainsched-name-input").val("");
  $("#dest-input").val("");
  $("#first-train-input").val("");
  $("#frequence-input").val("");
});

database.ref("train/schedules/").on("child_added", function(childSnapshot) {
  //console.log(childSnapshot.val());

  var trainNameResult = childSnapshot.val().trainName;
  var destinationResult = childSnapshot.val().destination;
  var frequencyResult = childSnapshot.val().frequency;
  var firstTrainTime = childSnapshot.val().firstTrain;

  
// figure out the timings

var startTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  //console.log(startTimeConverted);

  var currentTime = moment();
  //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // diff
  var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  //console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequencyResult;
  //console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequencyResult - tRemainder;
  //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
  //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  var newRow = $("<tr>").append(
    $("<td>").text(trainNameResult),
    $("<td>").text(destinationResult),
    $("<td>").text(frequencyResult),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain)
 
  );


  $("#trainsched-table > tbody").append(newRow);
  });

});