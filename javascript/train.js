// Initialize Firebase
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

//Iniital Values
  var name = "";
  var destination = "";
  var frequency = 0;
  var trainTime = "";
  var firstTrainTime = "";

$("#submit-train").on('click', function(event) {
	event.preventDefault();

	//collect data from the html form, create variables to hold the data
	//when retrieving the "first train" data, make sure to parse it into a unix timestamp
	name = $("#train-input").val().trim();
	destination = $("#destination-input").val().trim();
	frequency = ($("#frequency-input").val().trim());
	trainTime = ($("#time-input").val().trim());
	console.log(trainTime);
	firstTrainTime = moment(trainTime,"HH:mm").format('X');
	console.log(firstTrainTime);
	
	//'push' that data into firebase (assume that the 'child_added' listener updates html)
	trainData.ref().push({
		name: name,
		destination: destination,
		frequency: frequency,
		time: firstTrainTime
	});
	//alert that train was added
	console.log("Your train was added");
	//clear out our html form for the next input
	$(".user-input").val(' ');
	
});



trainData.ref().on('child_added', function(childSnapshot) {
	

	//create local variables to store the data from firebase
	var dataTrain = childSnapshot.val();
	console.log('the childSnapshot data', childSnapshot.val());
	console.log(childSnapshot.val().name);
	console.log(childSnapshot.val().destination);
	console.log(childSnapshot.val().frequency);
	console.log(childSnapshot.val().time);
	//create local variables to store the data from firebase

	//FIRST make the table row show up with empty strings for 'timeInMinutes'/'tArrival'

	//THEN do the math

		//compute the difference in time from 'now' and the first train, store in var
		var trainFrequency = childSnapshot.val().frequency;
		console.log(trainFrequency);
		var trainTime = ($("#time-input").val().trim());
		console.log(trainTime);
		// var firstTrainTime = moment(trainTime,"HH:mm").format('X');
		// console.log(firstTrainTime);
		var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
		console.log(firstTimeConverted);

		var currentTime = moment();
		console.log(currentTime);

		var difference = moment().diff(moment(firstTimeConverted), "minutes");
		console.log(difference);

		//get the remainder of time after using 'mod' with the frequency, store in var
		var remainder = difference % trainFrequency;
		console.log(remainder);
		//subtract the remainder from the frequency, store in var 'timeInMinutes'
		var timeInMinutes = trainFrequency - remainder;
		console.log(timeInMinutes);

		//format 'timeInMinutes' and store in var ('tArrival') aka "make pretty"
		var arrival = moment().add(timeInMinutes, "minutes");
		console.log(moment(arrival).format("h:mm:ss a'"));


		//append to our table of trains inside the 'tbody' with a new row of the train data
		$("#info-body").append("<tr><td class='table-text'>" + childSnapshot.val().name + "</td>" +
		"<td class='table-text'>" + childSnapshot.val().destination + "</td>" +
		"<td class='table-text'>" + childSnapshot.val().frequency + "</td>" +
		"<td class='table-text'>" + arrival.format("h:mm:ss a") + "</td>" +
		"<td class='table-text'>" + timeInMinutes + "</td>/tr>");
});