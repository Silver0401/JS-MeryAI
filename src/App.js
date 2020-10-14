// Libraries

import React, {useEffect, useState} from 'react';
import axios from "axios";
// import anime from "animejs";
import './App.css';

// Animation Components
import BotAnim from "./components/animations/Bot"
// import infinite from "./components/animations/infinite"

// Axios Stuff in case I need it someday

// useEffect(() => {
//   axios.get("/transcript")
//   .then((response) => getData(response.data.keywords))
//   .catch(err => console.log(`ERROR: ${err}`))
// })

function App() {

  const [Transcript, setTranscript] = useState("I'm listening...")
  const [Language, setLang] = useState("en-US")

  useEffect(() =>  {

    // Mery Commands

    const RunTCommand = (command) => {

      axios
        .post("/transcript", {
          action: command,
        })
        .then((response) => console.log(response.data))
        .catch((err) => console.log(`ActionCommand ERROR:${err}`));
        
      }
      
    const Speak = (response) => {

        axios
          .post("/speaking", {
            text: response
          })
          .then((res) => console.log(res.data))
          .catch(err => console.log(`SpeechSynthesis ERROR: ${err}`))
    }

    const SearchSong = (request) => {
      let SongNameList = []
      let counter = 0
      let checker = 1

      request.forEach((word) => {
        if (word === "search" || word === "song" || word === "track") {}
        else if (word === " ") {checker = 2}
        else {
          for (let c = 0; c <= word.length - 1; c++) {
            if (c === 0) SongNameList.push((word.charAt(0)).toUpperCase())
            else {
              SongNameList.push(word.charAt(c))
            }
          }

          if (counter < request.length - 1 && counter > checker ) SongNameList.push(" ")
        }

        counter += 1;
      })

      let songName = SongNameList.join("")

      if (songName === "Belt") songName = "Nur Noch Kurz Die Welt Retten"
      if (songName === "Kiss") songName = "Zou Bisou Bisou"
      if (songName === "for minutes") songName = "4 minutes"

      Speak(`Playing ${songName}`)
      RunTCommand(`osascript -e 'tell application "Music" to play track "${songName}"'`)
      console.log(`osascript -e 'tell application "Music" to play track "${songName}"'`)
    }

    const SearchPlayList = (request) => {

      let PlaylistNumber = []

      request.forEach((word) => {
        if (word === "search" || word === "playlist") { }
        else {
          PlaylistNumber.push(word)
        }
      })

      let DesiredPlaylist = PlaylistNumber.join("")

      switch (DesiredPlaylist) {
        case "working":
          Speak("Playing Playlist to Work")
          RunTCommand(`osascript -e 'tell app "Music" to play the playlist named "Arbeiten Musik"'`)
          break
        case "pop":
          Speak("Playing Playlist Pop songs ")
          RunTCommand(`osascript -e 'tell app "Music" to play the playlist named "POP"'`)
          break
        case "rock":
          Speak("Playing Playlist Rock Songs  ")
          RunTCommand(`osascript -e 'tell app "Music" to play the playlist named "Rock"'`)
          break
        case "sad":
          Speak("Playing Playlist Sad Songs ")
          RunTCommand(`osascript -e 'tell app "Music" to play the playlist named "Sad Songs :'3"'`)
          break
        case "dancing":
          Speak("Playing Playlist Dancing Songs ")
          RunTCommand(`osascript -e 'tell app "Music" to play the playlist named "Cumbiones Sabrosones"'`)
          break
        case "exercise" || "exercising":
          Speak("Playing Playlist to Exercise ")
          RunTCommand(`osascript -e 'tell app "Music" to play the playlist named "Insiprational Songs"'`)
          break
        default:
          Speak("I didn't find such playlist")
      }

    }

    // Initialize Mery AI

    const AIListenerSp = () => {
      console.log("reinit")
      console.log(Language)

      let grammar = "coso"

      var thingy = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();
      thingy.addFromString(grammar,1)

      var recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();

      let KeyWordHeard = false;
      recognition.grammars = thingy
      recognition.lang = "es-ES";
      recognition.interimResults = false;
      recognition.continuous = true;
      recognition.start();

      recognition.addEventListener("result", (event) => {
        const last = event.results.length - 1;
        let transcript = event.results[last][0].transcript;
        transcript = transcript.toLowerCase();
        let heard_my_name = false;
        let audio = transcript.split(" ");

        setTranscript(transcript)

        if (KeyWordHeard) {
          // AIAnimation();

          if (audio.includes("thanks") || audio.includes("nevermind")) {
            // console.log("sure thing");
            Speak("sure thing")
            KeyWordHeard = false;
          } 
          if (audio.includes("netflix state")) {
            if (audio.includes("stop")) {
              console.log("stopping netflix");
              // CPURemote("keyboardPress", "space");
            } else if (audio.includes("play")) {
              console.log("playing netflix");
              // CPURemote("keyboardPress", "space");
            }
          }
          if (audio.includes("next")) {
            RunTCommand(
              "osascript -e 'tell application \"Music\" to next track'"
            );
            Speak("changing to Next song")
          }
          if (audio.includes("previous")) {
            RunTCommand(
              "osascript -e 'tell application \"Music\" to previous track'"
            );
            Speak("changing to Previous song");
          }
          if (audio.includes("stop") || audio.includes("pause")) {
            RunTCommand("osascript -e 'tell application \"Music\" to pause'");
            Speak("Stopping song");
          }
          if (audio.includes("resume") || audio.includes("play")) {
            RunTCommand("osascript -e 'tell application \"Music\" to play'");
            Speak("Playing");
          }
          if (audio.includes("set") || audio.includes("modo")) {

            if (audio.includes("spanish") || audio.includes("español")) setLang("es-AR")
            if (audio.includes("english") || audio.includes("inglés")) setLang("en-US")

          }
          if (audio.includes("search")){

          }

        } else {
          const nameList = ["mery", "mary", "married", "ameri", "marry"];

          let filtered_list = audio.filter((word) => {
            return nameList.includes(word);
          });

          filtered_list.forEach((word) =>
            nameList.includes(word)
              ? (heard_my_name = true)
              : console.log("false")
          );

          // heard_my_name ? ((console.log("Yes, Sir?")), (KeyWordHeard = true), (recognition.addEventListener("end", recognition.start))) : (recognition.addEventListener("end", recognition.start));
          if (heard_my_name) {
            Speak("yes, Sir?")
            KeyWordHeard = true
          }

          recognition.addEventListener("end", recognition.stop)

        }
      });
    }

    const AIListenerEn = () => {
      console.log("reinit")
      console.log(Language)

      var recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();

      let KeyWordHeard = false;
      recognition.lang = "en-US";
      // recognition.maxAlternatives = 1
      recognition.interimResults = false;
      recognition.continuous = true;
      recognition.start();

      recognition.onresult = event => {
        const last = event.results.length - 1;
        let transcript = event.results[last][0].transcript;
        transcript = transcript.toLowerCase();
        let heard_my_name = false;
        let audio = transcript.split(" ");

        setTranscript(transcript)

        if (KeyWordHeard) {
          // AIAnimation();

          if (audio.includes("thanks") || audio.includes("nevermind")) {
            // console.log("sure thing");
            Speak("sure thing")
            KeyWordHeard = false;
          }
          if (audio.includes("netflix state")) {
            if (audio.includes("stop")) {
              console.log("stopping netflix");
              // CPURemote("keyboardPress", "space");
            } else if (audio.includes("play")) {
              console.log("playing netflix");
              // CPURemote("keyboardPress", "space");
            }
          }
          if (audio.includes("next")) {
            RunTCommand(
              "osascript -e 'tell application \"Music\" to next track'"
            );
            Speak("Next song")
          }
          if (audio.includes("previous")) {
            RunTCommand(
              "osascript -e 'tell application \"Music\" to previous track'"
            );
            Speak("changing to Previous song");
          }
          if (audio.includes("stop") || audio.includes("pause")) {
            RunTCommand("osascript -e 'tell application \"Music\" to pause'");
            Speak("Song stopped");
          }
          if (audio.includes("resume") || audio.includes("play")) {
            RunTCommand("osascript -e 'tell application \"Music\" to play'");
            Speak("Playing");
          }
          if (audio.includes("set") || audio.includes("modo")) {

            if (audio.includes("spanish") || audio.includes("español")) setLang("es-AR")
            if (audio.includes("english") || audio.includes("inglés")) setLang("en-US")

          }
          if (audio.includes("search")) {

            if (audio.includes("song") || audio.includes("track")) SearchSong(audio)
            if (audio.includes("playlist")) SearchPlayList(audio)
            
          }
          if (audio.includes("talk")){
            Speak("Hello World")
          }

        } else {
          const nameList = ["mery", "mary", "married", "ameri", "marry", "marion", "miriam", "amerie", "mario", "merry"];

          let filtered_list = audio.filter((word) => {
            return nameList.includes(word);
          });

          filtered_list.forEach((word) =>
            nameList.includes(word)
              ? (heard_my_name = true)
              : console.log("false")
          );

          if (heard_my_name) {
            Speak("Yes sir?")
            KeyWordHeard = true
          }

          recognition.addEventListener("end", recognition.start)
        }
      };
    }

    if (Language === "es-ES") AIListenerSp()
    if (Language === "en-US") AIListenerEn()

  },[Language])

  return (
    <div className="App">
      <div className="SvgBox">
        <BotAnim />
      </div>
      <div className="TextBox">
        <p>{Transcript}</p>
        {/* <p>Mery: {MeryResponse}</p> */}
      </div>
    </div>
  );
}

export default App;



