  var config = {
    apiKey: "AIzaSyB5XMXH7W-YoHFFV2oJ7wRQGv9Xl_-ciVE",
    authDomain: "train-scheduler-e9917.firebaseapp.com",
    databaseURL: "https://train-scheduler-e9917.firebaseio.com",
    projectId: "train-scheduler-e9917",
    storageBucket: "train-scheduler-e9917.appspot.com",
    messagingSenderId: "236124544841"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();

  var name = "";
  var destination = "";
  var frequency = 0;
  var trainTime = "";
  var firstTrainTime = "";

$("#submit-train").on('click', function(event) {
	event.preventDefault();
	name = $("#train-input").val().trim();
	destination = $("#destination-input").val().trim();
	frequency = ($("#frequency-input").val().trim());
	trainTime = ($("#time-input").val().trim());
	console.log(trainTime);
	firstTrainTime = moment(trainTime,"HH:mm").format('X');
	console.log(firstTrainTime);
	
	trainData.ref().push({
		name: name,
		destination: destination,
		frequency: frequency,
		time: firstTrainTime
	});
	console.log("Your train was added");
	$(".user-input").val(' ');
	
});

trainData.ref().on('child_added', function(childSnapshot) {
	
	var dataTrain = childSnapshot.val();
	console.log('the childSnapshot data', childSnapshot.val());
	console.log(childSnapshot.val().name);
	console.log(childSnapshot.val().destination);
	console.log(childSnapshot.val().frequency);
	console.log(childSnapshot.val().time);
	
		var trainFrequency = childSnapshot.val().frequency;
		console.log(trainFrequency);
	
		var trainTime = ($("#time-input").val().trim());
		console.log(trainTime);
	
		var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
		console.log(firstTimeConverted);
	
		var currentTime = moment();
		console.log(currentTime);
	
		var difference = moment().diff(moment(firstTimeConverted), "minutes");
		console.log(difference);

		var remainder = difference % trainFrequency;
		console.log(remainder);
	
		var timeInMinutes = trainFrequency - remainder;
		console.log(timeInMinutes);
	
		var arrival = moment().add(timeInMinutes, "minutes");
		console.log(moment(arrival).format("h:mm:ss a'"));

		$("#info-body").append("<tr><td class='table-text'>" + childSnapshot.val().name + "</td>" +
		"<td class='table-text'>" + childSnapshot.val().destination + "</td>" +
		"<td class='table-text'>" + childSnapshot.val().frequency + "</td>" +
		"<td class='table-text'>" + arrival.format("h:mm:ss a") + "</td>" +
		"<td class='table-text'>" + timeInMinutes + "</td></tr>");
});
