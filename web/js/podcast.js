var wavesurfer = WaveSurfer.create({
             container: '#waveform',
             waveColor: 'violet',
             progressColor: 'purple',
             barWidth: 3,
             backend: 'MediaElement',
         });

wavesurfer.on('ready', function () {
    $('#waveform').show();
    $('.controls').show();
    wavesurfer.playPause();});
wavesurfer.on('error', function (e) {
 Document.getElementById('waveform').innerHTML = e;
});
$('.controls .btn').on('click', function(){
      var action = $(this).data('action');
      console.log(action);
      switch (action) {
        case 'play':
          wavesurfer.playPause();
          if($(this).children().hasClass('fa-pause')){
            $(this).children().removeClass('fa-pause');
            $(this).children().addClass('fa-play-circle');
          }else{
            $(this).children().removeClass('fa-play-circle');
            $(this).children().addClass('fa-pause');
          }
          break;
        case 'back':
          wavesurfer.skipBackward();
          break;
        case 'forward':
          wavesurfer.skipForward();
          break;
        case 'mute':
          wavesurfer.toggleMute();

          if($(this).children().hasClass('fa-volume-off')){
            $(this).children().removeClass('fa-volume-off');
            $(this).children().addClass('fa-volume-up');
          }else{
            $(this).children().removeClass('fa-volume-up');
            $(this).children().addClass('fa-volume-off');
          }
          break;
        case 'reset':
          wavesurfer.empty();
          $(this).parent().hide();
        break;
      }
    });

    function createDownloadLink(blob) {
  
  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var li = document.createElement('li');
  var link = document.createElement('a');
var voice_message= document.getElementById('audio64');
  //name of .wav file to use during upload and download (without extendion)
  var filename = new Date().toISOString();

  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  var reader = new window.FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
       voice_message.value = reader.result;
  }

  //save to disk link
  link.href = url;
  link.download = filename+'.wav'; //download forces the browser to donwload the file using the  filename
  link.innerHTML = 'Save to disk';

  //add the new audio element to li
  li.appendChild(au);
  
  //add the filename to the li
  li.appendChild(document.createTextNode(filename+'.wav '))

  //add the save to disk link to li
  li.appendChild(link);
  //delete link
  var deletelink= document.createElement('a');
  deletelink.href='#delete';
  deletelink.innerHTML=' delete';
  deletelink.addEventListener('click',function(event){
    li.remove();
  });
  li.appendChild(deletelink);
  //upload link
  var upload = document.createElement('a');
  upload.href='#upload';
  upload.innerHTML = 'Upload';
  upload.addEventListener('click', function(event){
      var xhr=new XMLHttpRequest();
      var csrftoken = getCookie('_csrf');
      xhr.onload=function(e) {
          if(this.readyState === 4) {
              console.log('Server returned: ',e.target.responseText);
          }
      };
      var fd=new FormData();
      fd.append('audio_data',blob, filename);
      xhr.open('POST','contact',true);
      xhr.send(fd);
  })
  li.appendChild(document.createTextNode (' '))//add a space in between
  li.appendChild(upload)//add the upload link to li

  //add the li element to the ol
  //recordingsList.appendChild(li);
  wavesurfer.load(url);
}

function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


URL = window.URL || window.webkitURL;
var gumStream;            //stream from getUserMedia()
var rec;              //Recorder.js object
var input;              //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById('recordButton');
var stopButton = document.getElementById('stopButton');
var pauseButton = document.getElementById('pauseButton');

//add events to those 2 buttons
recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
pauseButton.addEventListener('click', pauseRecording);

function startRecording() {
  console.log('recordButton clicked');
    var constraints = { audio: true, video:false }
  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    console.log('getUserMedia() success, stream created, initializing Recorder.js ...');
    audioContext = new AudioContext();
    //update the format 
    document.getElementById('formats').innerHTML='Format: 1 channel pcm @ '+audioContext.sampleRate/1000+'kHz'
    /*  assign to gumStream for later use  */
    gumStream = stream;
    
    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);

    rec = new Recorder(input,{numChannels:1})

    //start the recording process
    rec.record()

    console.log('Recording started');

  }).catch(function(err) {
      //enable the record button if getUserMedia() fails
      recordButton.disabled = false;
      stopButton.disabled = true;
      pauseButton.disabled = true
      console.log(err);
  });
}

function pauseRecording(){
  console.log('pauseButton clicked rec.recording=',rec.recording );
  if (rec.recording){
    //pause
    rec.stop();
    
    pauseButton.innerHTML="<i class='fa fa-play-circle'></i>";
  }else{
    //resume
    rec.record();
    pauseButton.innerHTML="<i class='fa fa-pause-circle'></i>";
  }
}

function stopRecording() {
  console.log('stopButton clicked');
  //disable the stop button, enable the record too allow for new recordings
  stopButton.disabled = true;
  recordButton.disabled = false;
  pauseButton.disabled = true;

  //reset button just in case the recording is stopped while paused
  pauseButton.innerHTML="<i class='fa fa-pause-circle'></i>";
  //tell the recorder to stop the recording
  rec.stop();
  //stop microphone access
  gumStream.getAudioTracks()[0].stop();
  //create the wav blob and pass it on to createDownloadLink
  rec.exportWAV(createDownloadLink);
}