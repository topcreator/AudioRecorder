URL = window.URL || window.webkitURL;
var wavesurfer, context, processor, clocker;
var record_seconds = 0;
var gumStream;
var rec;
var input;
var micBtn;

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
context = new AudioContext();
processor = context.createScriptProcessor(4096, 1, 1);

// Init & load
document.addEventListener('DOMContentLoaded', function() {
    micBtn = document.querySelector('#micBtn');

    micBtn.onclick = function() {
        if (wavesurfer === undefined) {
            // Init wavesurfer
            wavesurfer = WaveSurfer.create({
                container: '#waveform',
                waveColor: '#026e00',
                interact: false,
                cursorWidth: 0,
                audioContext: context || null,
                audioScriptProcessor: processor || null,
                plugins: [WaveSurfer.microphone.create()]
            });

            wavesurfer.microphone.on('deviceReady', function() {
                console.info('Device ready!');
            });
            wavesurfer.microphone.on('deviceError', function(code) {
                console.warn('Device error: ' + code);
            });
            wavesurfer.microphone.start();
            startRecording();
            triggerClocker(true);
        } else {
            if (wavesurfer.microphone.active) {
                wavesurfer.microphone.stop();
                stopRecording();
                triggerClocker(false);
            } else {
                wavesurfer.microphone.start();
                startRecording();
                triggerClocker(true);
            }
        }
    };
});

function startRecording() {    
    var constraints = { audio: true, video:false }

    micBtn.innerHTML = "Stop recording...";
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		audioContext = new AudioContext();

		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1});
		rec.record();
		console.log("Recording started");

	}).catch(function(err) {
	  	console.log("Recording failed");
	});
}

function stopRecording() {
	console.log("stopRecording");
	micBtn.innerHTML = "Start recording...";
	rec.stop();
	gumStream.getAudioTracks()[0].stop();
	console.log("getAudioTracks", gumStream.getAudioTracks()[0]);
	rec.exportWAV(createDownloadLink);
	console.log("rec", rec);
}

function createDownloadLink(blob) {
	console.log("createDownloadLink")
	var url = URL.createObjectURL(blob);
	console.log("url", url);
	var au = document.createElement('audio');
	var li = document.querySelectorAll('.recorder-file')[0];
	var link = document.createElement('a');
	var filename = new Date().toISOString();

	li.innerHTML = "";

	au.controls = true;
	au.src = url;
	au.onended = function() {
		au.currentTime = 0
		if (confirm("Do you want replay audio?")) {
			au.play();
		}
	}

	link.href = url;
	link.download = filename+".wav";
	link.innerHTML = "Save to disk";

	li.appendChild(au);
	li.appendChild(link);

	console.log("li==html", li.innerHTML);
	
	//upload link
	var upload = document.createElement('a');
	upload.href="#";
	upload.innerHTML = "Upload";
	upload.addEventListener("click", function(event){
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
		  var fd=new FormData();
		  fd.append("audio_data",blob, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "));
	li.appendChild(upload);
}

function triggerClocker(isOn) {
	if (isOn) {
		record_seconds = 0;
		clocker = setInterval(secondsCounter, 1000);
	} else {
		clearInterval(clocker);
	}
}

function secondsCounter() {
	record_seconds += 1;
	var minutes = parseInt(record_seconds/60);
	var seconds = record_seconds % 60;

	document.querySelectorAll('.recorder-timer')[0].innerHTML = harold(minutes) + ":" + harold(seconds);
}

function harold(standIn) {
	if (standIn < 10) {
	  standIn = '0' + standIn
	}
	return standIn;
}