import React, {useState} from 'react';
import logo from './logo.svg';
import axios from "axios";
import './App.css';


function App() {

  const [Transcript, setTranscript] = useState("listening...")
  const [MeryResponse, setMeryResponse] = useState("")

  const RunTCommand = (command) => {
    // var cmd = require("node-cmd");
    // console.log(command)
    axios
      .post("/transcript", {
        action: command,
      })
      .then((response) => console.log(response.data))
      .catch((err) => console.log(`ERROR:${err}`));

    // cmd.run(command);
  };

  // useEffect(() => {
    
  //   axios.get("/transcript")
  //   .then((response) => getData(response.data.keywords))
  //   .catch(err => console.log(`ERROR: ${err}`))
  // })

  const AIListener = () => {
    // console.log("InsideAI");
    // const recognition = new webkitSpeechRecognition()
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
          setMeryResponse("sure thing")
          KeyWordHeard = false;
        } else if (audio.includes("netflix")) {
          if (audio.includes("stop")) {
            console.log("stopping netflix");
            // CPURemote("keyboardPress", "space");
          } else if (audio.includes("play")) {
            console.log("playing netflix");
            // CPURemote("keyboardPress", "space");
          }
        } else if (audio.includes("next")) {
          RunTCommand(
            "osascript -e 'tell application \"Music\" to next track'"
          );
          setMeryResponse("changing to Next song")
        } else if (audio.includes("previous")) {
          RunTCommand(
            "osascript -e 'tell application \"Music\" to previous track'"
          );
          setMeryResponse("changing to Previous song");
        } else if (audio.includes("stop")) {
          RunTCommand("osascript -e 'tell application \"Music\" to pause'");
          setMeryResponse("Stopping song");
        } else if (
          audio.includes("resume") || audio.includes("play"))
        {
          RunTCommand("osascript -e 'tell application \"Music\" to play'");
          setMeryResponse("Playing");
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
        if (heard_my_name){
          setMeryResponse("yes, Sir?")
          KeyWordHeard = true
          recognition.addEventListener("end", recognition.start)
        } else {
          recognition.addEventListener("end", recognition.start)
        }
      }
    });
  }

  AIListener()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>Transcript: {Transcript}</p>
        <p>Mery: {MeryResponse}</p>

      </header>
    </div>
  );
}

export default App;
