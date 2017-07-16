
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
			default:'spotify-this-song',
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

    	EnteredInTxt = false;

	    var Twitter = require('twitter');

	    var client = new Twitter({
		    consumer_key: conKey ,
		    consumer_secret: conSec,
		    access_token_key: accTok,
		    access_token_secret: accSec
	    });

		var params = {screen_name: 'NelumGT'};

	    var client = new Twitter({
		    consumer_key: conKey ,
		    consumer_secret: conSec,
		    access_token_key: accTok,
		    access_token_secret: accSec
	    });
		 
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		    if (!error) {

		    	var twitterD = JSON.stringify(tweets, null,2);

		    	var logArray = []; // for log.txt

			  	for (var i = 0 ; i < 20 ; i++){
			  		var twitterD = JSON.stringify(tweets, null,2);
					var textName = JSON.parse(twitterD)[i].text;
				  	console.log( (i+1) + " :   " + textName );
				  	logArray.push( "\n" + (i+1) + "  : " + textName)
				}

				// Log details
				var logTwitter =  "\n TWITTER DATA \n" + "----------------------\n" + logArray;
				writeLogs(logTwitter);
		    }
		  else{
				console.log("Twitter Error " + JSON.stringify(error, null, 2));
			}		  	
		});

	}


/******************************************************/
/************  Get the Spotify details ****************/
/******************************************************/

	// Prompt for song
	function enterSong(){

		EnteredInTxt = false;
		
		inquirer.prompt([
			{
			    type: "input",
			    name: "songName",
			    message: "Enter a song Name : "
			}
		]).then(function(song) { 
			var songName = song.songName;
			songName = JSON.stringify(songName, null, 2);
			findSpotify(songName)
				
		})
		.catch(function(err) {
		    console.log(err)
		});
    }


	// Find the song details in spotify
	function findSpotify(specificName){

		var clientId = keys.spotifyKeys.Client_ID;
		var clientSecret = keys.spotifyKeys.Client_Secret;

		var spotifyApi = require('node-spotify-api');

		var spotify = new spotifyApi({
			id: clientId,
			secret: clientSecret
		});

		spotify.search({type: 'track' , query: specificName}, function(error,data,response){
			if (error){
				return console.log('Spotify Error : ' + error);
			}
			else{
				console.log(">>>>>>>>> " + JSON.parse(JSON.stringify(data)));

				if (data == null || data == undefined){
					console.log("Couldn't find data");
				}
				else{
					var spotifyData = JSON.parse(JSON.stringify(data)).tracks;
					spotifyData = JSON.parse(JSON.stringify(spotifyData,null,2)).items[0];
					spotifyData = JSON.parse(JSON.stringify(spotifyData,null,2)).album;		

					// Find Artist
					var artists = JSON.parse(JSON.stringify(spotifyData,null,2)).artists;
					artists = JSON.parse(JSON.stringify(artists[0],null,2)).name;
					artist = JSON.stringify(artists,null,2);

					var previewLink = JSON.parse(JSON.stringify(spotifyData,null,2)).href;
					var albumName = JSON.parse(JSON.stringify(spotifyData,null,2)).name;

					var copyData = "\n SPOTYFY DATA \n" + "----------------------\n" +
						"Artist Name  :   " + artist + "\n" +
						"Song Name    :   " + specificName + "\n" +
						"Preview Link :   " + previewLink + "\n" +
						"Album Name   :   " + albumName + "\n";

					console.log(copyData);
					writeLogs(copyData);
				}
			}
		});

	};



/******************************************************/
/************  Get the movie details ******************/
/******************************************************/

	// Prompt for Movie Details
	function enterMovieName(){

		EnteredInTxt = false;

		inquirer.prompt([
			{
			    type: "input",
			    name: "movieName",
			    message: "Enter a Movie Name : "
			}
		]).then(function(movie) { 
			var movieName = movie.movieName;
			var movieName = JSON.stringify(movieName, null, 2);
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

	  	if (movieName == undefined || movieName == null) {
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

		  	  	var rottenTomatoes = JSON.parse(body).Ratings;
		  	  	console.log(rottenTomatoes);
		  	  	if (rottenTomatoes == undefined){
		  	  		rottenTomatoes = "Not Available";			  	  	
			  	}
			  	else{
			  		if (rottenTomatoes[1] == null){
			  	  		console.log("null");
			  	  		rottenTomatoes = "Not Available";
			  	  	}
			  	  	else{
				  	  	rottenTomatoes = JSON.parse(JSON.stringify(rottenTomatoes[1],null,2)).Value;
				  	  	rottenTomatoes = JSON.stringify(rottenTomatoes,null,2);
			  	  	}
			  	}

		  	  	var movieData = "\n OMDB DATA \n" + "----------------------\n" +
					"Title of the Movie     :   " + JSON.parse(body).Title + "\n" +
					"Year                   :   " + JSON.parse(body).Year + "\n" +
					"IMDB Rating            :   " + JSON.parse(body).imdbRating + "\n" +
					"Rotton Tomatoes Rating :   " + rottenTomatoes + "\n" +
					"County movie produced  :   " + JSON.parse(body).Country + "\n" +
					"Language               :   " + JSON.parse(body).Language + "\n" +
					"Plot of the movie      :   " + JSON.parse(body).Plot + "\n" +
					"Actors                 :   " + JSON.parse(body).Actors + "\n";

		  	  	writeLogs(movieData);
		  	  	console.log(movieData);
		    }
		    else{
		    	console.log("Couldnt find the Movie");
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

	
	/******************************************************/
	/************  Write Logs to log.txt ******************/
	/******************************************************/

	function writeLogs(data){

		var fs = require("fs");

		// We then store the textfile filename given to us from the command line
		var textFile = data;

		// We then append the contents "Hello Kitty" into the file
		// If the file didn't exist then it gets created on the fly.
		var AddingtoLog = " \n\n /**********************************************************/ " 
						+ "\n\n\n\n" +  data;	

		fs.appendFile("log.txt", AddingtoLog , function(err) {

		    if (err) { 
		    	console.log(err);
		    }
		    else {
		   		console.log("Content Added!");
		    }
        });

	}