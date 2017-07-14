  
  // Keys from the keys.js	
  var keys = require("./keys.js");

  console.log("Consumer Key : " + keys.twitterKeys.consumer_key);
  console.log("Consumer Secret : " + keys.twitterKeys.consumer_secret);
  console.log("Access Token Key : " + keys.twitterKeys.access_token_key);
  console.log("Access Token Sectret : " + keys.twitterKeys.access_token_secret);

  // Get a value from the command line
  var type = process.argv[2];

  // Identify the user input
  switch(type){
    case 'my-tweets':
      console.log("WhatsGonnaHappen");
      break;
    case 'spotify-this-song':
      break;
    case 'movie-this':
      break;
    case 'do-what-it-says':
      break;
    default:
      console.log("Not a valid response");
  }

  

