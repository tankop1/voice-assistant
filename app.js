const startBtn = document.getElementById('samantha-button');
const result = document.getElementById('samantha-result');
const processing = document.getElementById('samantha-processing');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (typeof SpeechRecognition === "undefined") {
  alert('Your browser does not support the Speech API. Please download the latest version of Google Chrome to use Samantha.');
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = event => {
   const last = event.results.length - 1;
   const res = event.results[last];
   const text = res[0].transcript;
    
   if (res.isFinal) {
      processing.innerHTML = 'processing ....';
      const response = process(text);
      const p = document.createElement("p");
      result.innerHTML = `You said: ${text} </br>Siri said: ${response}`;
      processing.innerHTML = '';
      speechSynthesis.speak(new SpeechSynthesisUtterance(response));
   }
    
   else {
      processing.innerHTML = `listening: ${text}`;
   }
}

let listening = false;
toggleBtn = () => {
   if (listening) {
      recognition.stop();
      startBtn.innerHTML = '<img class="mic-img" src="https://img.icons8.com/ios-filled/100/000000/microphone--v1.png" />';
   } else {
      recognition.start();
      startBtn.innerHTML = '<img class="mic-img" src="https://img.icons8.com/ios-filled/100/000000/block-microphone.png"/>';
   }
   listening = !listening;
};
startBtn.addEventListener("click", toggleBtn);

function process(rawText) {
   // remove space and lowercase text
   let text = rawText.replace(/\s/g, "");
   text = text.toLowerCase();
   let response = null;

   toggleBtn();

   if (text.includes('play')) {
      if (text.includes('montero') || text.includes('callmebyyourname')) {
         wave = new CircularAudioWave(document.getElementById('samantha-visual'));
         wave.loadAudio('audio/montero.mp3');
         response = 'Playing Montero by Lil Nas X';
         setTimeout(() => {
            wave.play();
         }, 4000);
      }

      else if (text.includes('industrybaby')) {
         wave = new CircularAudioWave(document.getElementById('samantha-visual'));
         wave.loadAudio('audio/industryBaby.mp3');
         response = 'Playing Industry Baby by Lil Nas X';
         setTimeout(() => {
            wave.play();
         }, 4000);
      }

      else {
         response = 'I could not find the song you were looking for';
      }
   }

   if (text.includes('pause')) {
      wave.stop();
      response = 'Music paused';
   }

   if (text.includes('time')) {
      response = 'The current time is ' + new Date().toLocaleTimeString().slice(0, 4) + new Date().toLocaleTimeString().slice(8, 10);
   }

   if (text.includes('search')) {
      window.open(`http://google.com/search?q=${rawText.replace("search", "")}`, "_blank");
      response = 'I found some information for ' + rawText.replace("search", "");
   }

   if (text.includes('.nevermind')) {
      response = 'Ok, let me know if you need anything';
   }

   if (!response) {
      return 'I did not understand you';
   }

   return response;
}

// AUDIO VISUALIZER
let wave = new CircularAudioWave(document.getElementById('samantha-visual'));
wave.loadAudio('audio/industryBaby.mp3');