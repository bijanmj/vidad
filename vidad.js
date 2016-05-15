module.exports = function(app) {

	// Register as a middleware
	app.use(function(req, res, next){
		

		res.sendVideo = function(mainVideoFile, adVideoFile, adTime, callback){
			
			var fs = require('fs');
			var videoFile;
			var videoMimeTypes = {
				"flv": "video/x-flv",
				"f4v": "video/mp4",
				"f4p": "video/mp4",
				"mp4": "video/mp4",
				"asf": "video/x-ms-asf",
				"asr": "video/x-ms-asf",
				"asx": "video/x-ms-asf",
				"avi": "video/x-msvideo",
				"mpa": "video/mpeg",
				"mpe": "video/mpeg",
				"mpeg": "video/mpeg",
				"mpg": "video/mpeg",
				"mpv2": "video/mpeg",
				"mov": "video/quicktime",
				"movie": "video/x-sgi-movie",
				"mp2": "video/mpeg",
				"qt": "video/quicktime",
				"mp3": "audio/mpeg",
				"wav": "audio/x-wav",
				"aif": "audio/x-aiff",
				"aifc": "audio/x-aiff",
				"aiff": "audio/x-aiff",
				"webm": "video/webm",
				"ts": "video/mp2t",
				"ogg": "video/ogg"
			};			


			// Decide which video to stream
			if(req.body.mainStream)
				videoFile = mainVideoFile;

			else if(req.body.adStream)
				videoFile = adVideoFile;

			else
				return callback('Stream file not identified in the request body');


			// stream video file
			fs.stat(videoFile, function(err, stats){

				if(err) //file error
					callback(err);

			    var range = req.headers.range;
			    if (!range) { // check to see if the range headers is set
			       return callback('Range not satisfied');
			    }
			      

			    // Parse the request  
			    var positions = range.replace(/bytes=/, '').split('-');
			    var start = parseInt(positions[0], 10);
			    var total = stats.size;
			    var end = positions[1] ? parseInt(positions[1], 10) : total - 1; 
			    var chunkSize = (end - start) + 1;


			    // calculate the location where the advertisement clip needs to be shown
			    var adPoint = Math.floor(stats.size * adTime);


			    if(!req.body.adViewed){ // Check to see if the advertisemt clip is watched
			    	if(start >= adPoint)
			    		res.status(205).send(adPoint); // end the trasmission with a reset response

			    	else if(end > adPoint) 
			    		end = adpoint; // Do not send any data beyond adPoint
			    }
				      

    			var mimeType = videoMimeTypes[videoFile.substr(videoFile.lastIndexOf('.')+1)]; //get the video mime type by file extension



    			// send data chunck
			    res.writeHead(206, { 
			      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
			      'Accept-Ranges': 'bytes',
			      'Content-Length': chunkSize,
			      'Content-Type': mimeType
			    });

			    var videoStream = fs.createReadStream(videoFile, { start: start, end: end });

			    videoStream.on('open', function() {
			      videoStream.pipe(res);
			    });

			    videoStream.on('error', function(err) {
			      callback(err);
			    });

			}); //videoFile stat
		}; // sendVideo()





		console.log('Vidad middleware started');
		next();
	});
};