
	var radio = require('prompt-radio'); // First input of selections
	var Enquirer = require('enquirer'); // First input of selections

	var inquirer = require('inquirer'); 

	var keys = require("./keys.js"); // Keys from the keys.js

	var EnteredInTxt = false;
	var globalTxtValue;

/* Step 01 */

	// Find your selection with the radio buttons
	var enquirer = new Enquirer();

	enquirer.register('radio',require('prompt-radio'));

	var questions = [
		{
			name:'userChoice',
			message: 'What is your preference',
			type:'radio',
			default:'movie-this',
			choices:['my-tweets','spotify-this-song','movie-this','do-what-it-says']
		}
	];

	enquirer.ask(questions)
		.then(function(answers){

			var justAnswer = answers.userChoice;

			findSearch(justAnswer); // goto the swith for further processings
		})
		.catch(function(err) {
		    console.log(err)
		});


/* Step 02 */

	// The switch to find the user requirement
	function findSearch(answer){

		// Identify the user input
		switch(answer){
			case 'my-tweets':
		        findTwitter();
		        break;
		    case 'spotify-this-song':
		    	enterSong();
		        break;
		    case 'movie-this':
		    	enterMovieName();
		        break;
		    case 'do-what-it-says':
		    	findTxt();
		        break;
		    default:
		        console.log("Not a valid response");
		        break;
	    }
	}


/* Step 03 */ 

/******************************************************/
/************  Get the Twitter details ****************/
/******************************************************/

    // Keys from the keys.js	
    var conKey = keys.twitterKeys.consumer_key;
    var conSec = keys.twitterKeys.consumer_secret;
    var accTok = keys.twitterKeys.access_token_key;
    var accSec = keys.twitterKeys.access_token_secret;

    /*console.log("Consumer Key : " + conKey + " | Consumer Secret : " + keys.twitterKeys.consumer_secret +
    " | Access Token Key : " + keys.twitterKeys.access_token_key + 
    " | Access Token Sectret : " + keys.twitterKeys.access_token_secret);*/

    function findTwitter(){

	   var Twitter = require('twitter');

	    var client = new Twitter({
		    consumer_key: conKey ,
		    consumer_secret: conSec,
		    access_token_key: accTok,
		    access_token_secret: accSec
	    });

	    var params = {screen_name: 'nodejs'};

	    client.get('search/tweets',{q: 'node.js'},function(error,tweets,response){
		  	if(!error){
		  		console.log(tweets);
		  	}
		  	for (var i = 0 ; i < 20 ; i++){
		  		console.log(JSON.stringify(response, null, 2));
		  	}		  	
		});

	}


/******************************************************/
/************  Get the Spotify details ****************/
/******************************************************/
	// Prompt for song
	function enterSong(){

		inquirer.prompt([
			{
			    type: "input",
			    name: "songName",
			    message: "Enter a song Name : "
			}
		]).then(function(song) { 
			var songName = song.songName;
			var songName = JSON.stringify(songName, null, 2);
			if (songName != null){
				if (EnteredInTxt === false){
					findSpotify(songName);
				}
				else{
					findSpotify(globalTxtValue);
				}
			}			
		})
		.catch(function(err) {
		    console.log(err)
		});
	}

	// Find the song details in spotify
	function findSpotify(specificName){
		console.log(specificName);

		var clientId = keys.spotifyKeys.Client_ID;
		var clientSecret = keys.spotifyKeys.Client_Secret;

		var spotifyApi = require('node-spotify-api');

		var spotify = new spotifyApi({
			id: clientId,
			secret: clientSecret
		});

		if (specificName == 'undefined' || specificName == null) {
	  		specificName = "Mr Nobody";
	  	}	

		spotify.search({type: 'track' , query: 'all the small'}, function(error,data,response){
			if (error){
				return console.log('Spotify Error : ' + error);
			}
			console.log(JSON.stringify(data, null, 2));
		});

	};



/******************************************************/
/************  Get the movie details ******************/
/******************************************************/

	// Prompt for Movie Details
	function enterMovieName(){

		inquirer.prompt([
			{
			    type: "input",
			    name: "movieName",
			    message: "Enter a Movie Name : "
			}
		]).then(function(movie) { 
			var movieName = movie.movieName;
			var movieName = JSON.stringify(movieName, null, 2);
			//console.log(">>>>>>>" + JSON.stringify(songName, null, 2));
			if (movieName != null){
				findMovie(movieName);
			}			
		})
		.catch(function(err) {
		    console.log(err)
		});
	}

	// Find Movie details
	function findMovie(movieName){
	  	console.log("specif : " + movieName);
	  	if (movieName == 'undefined' || movieName == null) {
	  		movieName = "Mr Nobody";
	  	}

	  	var movieKey = keys.movieKeys.movieKey;

	  	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieKey;

	  	var request = require('request');

	  	request( queryUrl, function(error, response, body){
	  	 
		  	if(error){
		  	    console.log("Error File OMDB : " + error);
		    }

		    if(response.statusCode === 200){
		  	  	console.log("Title of the Movie : " + JSON.parse(body).Title);
		  	  	console.log("Year : " + JSON.parse(body).Year);
		  	  	console.log("IMDB Rating : " + JSON.parse(body).imdbRating);
		  	  	//console.log("Rotton Tomatoes Rating : " + JSON.parse(body).Ratings[1]; // Ratings: [{},{Source:'',Value:''}]
		  	  	console.log("County where the movie was produced : " + JSON.parse(body).Country);
		  	  	console.log("Language of the Movie : " + JSON.parse(body).Language);
		  	  	console.log("Plot of the Movie : " + JSON.parse(body).Plot);
		  	  	console.log("Actors of the Movie : " + JSON.parse(body).Actors);
		    }

	  	});
	};

  
/******************************************************/
/*******************  get.txt  ************************/
/******************************************************/

	// Find Text File in random.txt
	function findTxt(){

		var fs = require('fs');

		fs.readFile("random.txt","utf8", function(error,data){
			if(error){
				console.log(error);
				return;
			}

			data = data.split(",");

			type = data[0];
			specificName = data[1];
			console.log(">>>>>>>>>>> " + data[0] + "  " + data[1]);
			EnteredInTxt = true;
			globalTxtValue = data[1];
			findSearch(data[0]);

		});


	}

	
	