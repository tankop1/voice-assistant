const startBtn = document.getElementById('samantha-button');
const result = document.getElementById('samantha-result');
const processing = document.getElementById('samantha-processing');
let alwaysListening = false; // EXERIMENTAL FEATURE

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
      processing.innerHTML = '';
      
      if (typeof response != 'object') {
         let speech = new SpeechSynthesisUtterance(response);
         speechSynthesis.speak(speech);
         result.innerHTML = response;
         speech.onend = () => {
            if (alwaysListening) {
               toggleBtn();
            }
         }
      }
      
      else { // THIS WOULD MEAN THE RESPONSE IS A JOKE AND NEEDS A DELAY
         let speechOne = new SpeechSynthesisUtterance(response[0]);
         speechSynthesis.speak(speechOne);
         result.innerHTML = response[0];
         speechOne.onend = () => {
            let speechTwo = new SpeechSynthesisUtterance(response[1]);
            speechSynthesis.speak(speechTwo);
            result.innerHTML = response[1];
            speechTwo.onend = () => {
               if (alwaysListening) {
                  toggleBtn();
               }
            };
         }
      }
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

// -----------------------
// INITIAL SKILL FUNCTIONS
// -----------------------

// SK I1 - Gets the current date
function getDate() {

   let currentDate = new Date();

   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
   const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   const ordinalNumbers = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'];

   return `Today is ${weekDays[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${ordinalNumbers[currentDate.getDate() - 1]}.`;
}

// SK I2 - Greets the user in a random way
function randomGreeting() {
   const greetingResponses = ['Hey, what\'s up?', 'How\'s it going?', 'Good to hear your voice.', 'Hello!', 'What can I do for you today?'];
   return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
}

// SK I3 - Says a random joke
function randomJoke() {

   const jokeSetups = ['What\'s the best thing about Switzerland?', 'Did you hear about the mathematician who\'s afraid of negative numbers?', 'Why do we tell actors to break a leg?', 'Did you hear about the claustrophobic astronaut?']
   const jokePunchlines = ['I don\'t know, but the flag is a big plus.', 'He\'ll stop at nothing to avoid them.', 'Because every play has a cast.', 'He just needed a little space.']

   let randomNum = Math.floor(Math.random() * jokeSetups.length);

   let setup = jokeSetups[randomNum]
   let punchline = jokePunchlines[randomNum]

   return [setup, punchline];
}

// SK I4 - Plays a song chosen by the user
function playSong(path, title, artist) {
   
   wave = new CircularAudioWave(document.getElementById('samantha-visual'));
   wave.loadAudio(path);
   setTimeout(() => {
      wave.play();
   }, 4000);

   return `Playing ${title} by ${artist}`;
}


// -------------------
// FUN SKILL FUNCTIONS
// -------------------

// SK 001 - Are You Stupid?
function areYouStupid() {
   const stupidResponses = ['Yes, they are very stupid', 'No, they are actually pretty smart', 'Uhh, obviously', 'No, definitely not', 'You make Porter look smart'];
   return stupidResponses[Math.floor(Math.random() * stupidResponses.length)];
}

// SK 002 - Motivational Quote of the Day
function randomQuote() {

   const quotes = ['The Best Way To Get Started Is To Quit Talking And Begin Doing.', 'The Pessimist Sees Difficulty In Every Opportunity. The Optimist Sees Opportunity In Every Difficulty.', 'It’s Not Whether You Get Knocked Down, It’s Whether You Get Up.', 'If You Are Working On Something That You Really Care About, You Don’t Have To Be Pushed. The Vision Pulls You.']
   const authors = ['Walt Disney', 'Winston Churchill', 'Vince Lombardi', 'Steve Jobs']
   
   let randomNum = Math.floor(Math.random() * quotes.length)
   let dailyQuote = quotes[randomNum];
   let quoteAuthor = authors[randomNum];

   return [dailyQuote, quoteAuthor];
}


// ------------
// PROCESS TEXT
// ------------

function process(rawText) {
   // remove space and lowercase text
   let text = rawText.replace(/\s/g, "");
   text = text.toLowerCase();
   let response = null;
   // stop listening
   toggleBtn();

   // TEXT PROCESSING
   const greetingInputs = ['hi', 'whassup', 'whatsup', 'what\'sup', 'hello'];

   for (let i = 0; i < greetingInputs.length; i++) {
      if (text.includes(greetingInputs[i])) {
         response = randomGreeting();
      }
   }

   if (text.includes('aboutyou')) {
      response = 'I am an artificial intelligence created by Tanner Kopel that can do simple tasks like play music and tell jokes';
   }

   if (text.includes('joke')) {
      response = randomJoke();
   }

   if (text.includes('quote')) {
      response = randomQuote();
   }

   if (text.includes('stupid')) {
      response = areYouStupid();
   }

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

      else if (text.includes('buttercup')) {
         response = playSong('audio/buildMeUpButtercup.mp3', 'Build Me Up Buttercup', 'The Foundations');
      }

      else if (text.includes('crazy')) {
         response = playSong('audio/crazy.mp3', 'Crazy', 'Gnarls Barkley');
      }

      else if (text.includes('dreamon')) {
         response = playSong('audio/dreamOn.mp3', 'Dream On', 'Aerosmith');
      }

      else if (text.includes('fatherofall')) {
         response = playSong('audio/fatherOfAll.mp3', 'Father of All', 'Green Day');
      }

      else if (text.includes('firereadyaim')) {
         response = playSong('audio/fireReadyAim.mp3', 'Fire Ready Aim', 'Green Day');
      }

      else if (text.includes('fooledaround')) {
         response = playSong('audio/fooledAroundAndFellInLove.mp3', 'Fooled Around and Fell In Love', 'Elvin Bishop');
      }

      else if (text.includes('ghosttown')) {
         response = playSong('audio/ghostTown.mp3', 'Ghost Town', 'Kanye West');
      }

      else if (text.includes('glorious')) {
         response = playSong('audio/glorious.mp3', 'Glorious', 'Macklemore');
      }

      else if (text.includes('levitating')) {
         response = playSong('audio/levitating.mp3', 'Levitating', 'Dua Lipa and Da Baby');
      }

      else if (text.includes('saveyourtears')) {
         response = playSong('audio/saveYourTears.mp3', 'Save Your Tears', 'The Weekend');
      }

      else if (text.includes('timber')) {
         response = playSong('audio/timber.mp3', 'Timber', 'Pitbull and Kesha');
      }

      else if (text.includes('touchthesky')) {
         response = playSong('audio/touchTheSky.mp3', 'Touch The Sky', 'Kanye West');
      }

      else {
         response = 'I could not find the song you were looking for';
      }
   }

   if ((text.includes('today') && text.includes('day')) || text.includes('date')) {
      response = getDate();
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

   if (text.includes('nevermind')) {
      response = 'Ok, let me know if you need anything';
   }

   if (text.includes('funny')) {
      response = 'Thanks, I\'m a pretty funny guy';
   }

   if (text.includes('howareyou')) {
      response = 'I\'m doing pretty good, thanks for asking';
   }

   if (text.includes('sad')) {
      response = 'Do you want to talk about it? It can be good to get your feelings out. I can stop recording if you\'d like.';
   }

   if (text.includes('badjoke')) {
      response = 'If you wanted better, you should have asked Alexa';
   }

   if (text.includes('thanks') || text.includes('thankyou')) {
      response = 'No problem, I\'m always happy to help';
   }

   if (text.includes('shutdown')) {
      response = 'Shutting down';
      alwaysListening = false;
   }

   if (!response) {
      return 'I did not understand you';
   }

   return response;
}


// ----------------
// UI FUNCTIONALITY
// ----------------

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