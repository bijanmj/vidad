#  VidAd - Express middleware to send in-stream ads

VidAd offers a simple way to show in-stream ads during the streaming of large videos.


## Installation

To install using [npm]

```
npm install vidad
```



## Setup

To setup VidAd you only need to include the following line right after creating your express app instance:

```
var app = express();  // Create your Express app
require('vidadd')(app);  // include this line to setup middleware
```



## Usage

To stream out the main video as well as the in-stream ad clip, include the following line:

```
res.sendVideo(mainVideoFile, adClipFile, relativePosition, function(err){ /* Error handling code goes here */ });
```

A detailed description of arguments comes below:

### mainVideoFile

The first argument is the main video file name


### adClipFile

The second argument is the ad clip file name which is going to be served as the in-stream ad


### relativePosition

The third argument is the a number between 0 and 1 that specifies the position where the in-stream ad is to be shown

### callback

The last argument is a callback function to handle errors.
The following errors are provided to the callback:

- Error: ENOENT, no such file or directory

	(The file does not exist or the path is not correct)

- Error: Range not satisfied 

	(Video player app does not provide a range header to the server)

- Error: Stream file not identified in the request body

	(Video player app not specified which video needs to be played)


## Example
The following example is a simple app to send the "main-video.mp4" file to the Video player app and shows the "ad-video-clip.mp4" file, right at the middle of streaming.

```
var express = require('express');
var path = require('path');
var app = express();
require('vidadd')(app);


app.route('/get-video').get(function(req, res){
  
  res.sendVideo(path.resolve(__dirname,"main-video.mp4"), 
  				path.resolve(__dirname,"ad-video-clip.mp4"), 
  				0.5, 
  				function(err){
	  				if(err){
	  					console.log(err);
	  					res.status(400).send('I hate to say that, but something went wrong!');
	  				}
  			});
});


app.listen(8080, function(){
  console.log('App started on port 8080');
});
``` 


## License

MIT