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
      result.innerHTML = response;
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
      startBtn.innerHTML = '<img class="mic-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/microphone--v1.png" />';
   } else {
      recognition.start();
      startBtn.innerHTML = '<img class="mic-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/block-microphone.png"/>';
   }
   listening = !listening;
};
startBtn.addEventListener("click", toggleBtn);

function playSong(path, title, artist) {
   wave = new CircularAudioWave(document.getElementById('samantha-visual'));
   wave.loadAudio(path);
   setTimeout(() => {
      wave.play();
   }, 4000);
   return `Playing ${title} by ${artist}`;
}

function process(rawText) {
   // remove space and lowercase text
   let text = rawText.replace(/\s/g, "");
   text = text.toLowerCase();
   let response = null;

   toggleBtn();

   if (text.includes('play')) {
      if (text.includes('montero') || text.includes('callmebyyourname')) {
         response = playSong('audio/montero.mp3', 'Montero', 'Lil Nas X');
      }

      else if (text.includes('industrybaby')) {
         response = playSong('audio/industryBaby.mp3', 'Industry Baby', 'Lil Nas X');
      }

      else if (text.includes('givemeeverything')) {
         response = playSong('audio/giveMeEverything.mp3', 'Give Me Everything', 'Pitbull');
      }

      else if (text.includes('imsosorry') || text.includes('i\'msosorry')) {
         response = playSong('audio/imSoSorry.mp3', 'I\'m So Sorry', 'Imagine Dragons');
      }

      else {
         response = 'I could not find the song you were looking for';
      }
   }

   if (text.includes('pause') || text.includes('stopmusic')) {
      window.location.reload();
      response = 'Music stopped';
   }

   if (text.includes('time')) {
      response = 'The current time is ' + new Date().toLocaleTimeString().slice(0, 5) + new Date().toLocaleTimeString().slice(8, 11);
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

// EMERGENCY STOP BUTTON

let emergencyStop = document.getElementById('emergency-stop');
let progressBars = document.getElementsByClassName('progress-inner');
let intervalId // FOR startRandomCode FUNCTION AT LINE 187

emergencyStop.onclick = () => {
   document.getElementById('samantha-visual').style.filter = 'grayscale(100%) brightness(0.8)';
   clearInterval(intervalId);

   for (let i = 0; i < progressBars.length; i++) {
      progressBars[i].style.width = '0%';
   }

   setTimeout(() => {alert('Samantha has been temporarily shutdown. If you would like to reboot her, please reload the page.')}, 1000);
}

// AUDIO VISUALIZER
let wave = new CircularAudioWave(document.getElementById('samantha-visual'));
wave.loadAudio('audio/industryBaby.mp3');

// ANIMATE CODE
let codeElement = document.getElementById('code');
let codeParent = document.getElementById('code-container');

function getCode() {
   let randomCode = [
      `let samanthaOn = true`,
      `const samanthaSerialNumber = 923488293`,
      `function getSamanthaVersion() {
         return '2.0.0';
      }`,
      `const samanthaFunctionality = () => {
         // EXECUTE HELPER FUNCTION
         samanthaHelper();
      }`,
      `const samanthaActivation = e => {
         e.target.value = 'activated';
      }`,
      `for (let i = 0; i < skills.length; i++) {
         samantha.skills.push(skills[i]);
      }`,
      `class Samantha:
         constructor(version, skills) {
            this.version = version
            this.skills = skills
         }`,
      `let samantha = Samantha('2.0.0', []);`,
      `console.log(samantha.version);`,
      `for (greeting in greetings) {
         console.log(greeting);
      }`,
      `if (samantha.active) {
         activateButton.innerHTML = 'Stop';
      } else {
         activateButton.innerHTML = 'Start';
      }`,
      `switch (greeting) {
         case 'Hello':
            return 'Hello!';
         case 'How are you':
            return 'Good, how about you?!';
         default:
            return 'Please repeat your greeting';
      }`,
      `const weather = {temperature: 80, system: 'celcius', type: 'cloudy'}`,
      `activateButton.addEventListener('click', samanthaActivation);`
   ];

   return randomCode[Math.floor(Math.random() * randomCode.length)];
}

function startRandomCode() {
   return setInterval(() => {
      let oldHTML = codeElement.innerHTML;
      let newHTML = oldHTML + '\n' + getCode();
      codeElement.innerHTML = newHTML;
      codeParent.scrollTop = codeParent.scrollHeight;
   }, 400);
}

intervalId = startRandomCode();