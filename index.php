<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<link rel="stylesheet" type="text/css" href="./assets/css/style.css">
	<script src="https://unpkg.com/wavesurfer.js/dist/wavesurfer.js"></script>
	<script src="https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.microphone.js"></script>
	<script src="https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js"></script>
</head>
<body>
	<div class="container">
		<div class="recorder-wrapper">
			<div><h2>Audio Recorder</h2></div>
		    <div id="waveform"></div>
		    <div class="recorder-timer">00:00</div>
		    <div class="recorder-controls">
		        <button id="micBtn">
		            Start recording...
		        </button>
		    </div>
		    <div class="recorder-file">
		    </div>
		</div>
	</div>
	<script type="text/javascript" src="./assets/js/app.js"></script>
</body>
</html>
