// Libraries
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styling/css/App.css";

// Animation Components
import BotAnim from "./components/animations/Bot";

function App() {
  const [MuteButtonState, setMuteButtonState] = useState(false);
  const nameList = [
    "mery",
    "mary",
    "ameri",
    "marry",
    "marion",
    "miriam",
    "amerie",
    "mario",
    "merry",
    "mari",
  ];

  // Mery Commands

  const RunTCommand = (command) => {
    axios
      .post("/transcript", {
        action: command,
      })
      .then((response) => console.log(response.data))
      .catch((err) => console.log(`ActionCommand ERROR:${err}`));
  };

  const RunTInfoFetcher = (command) => {
    axios
      .post("/dataFetcher", {
        action: command,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(`ActionCommand ERROR:${err}`));
  };

  const CPURemote = (command) => {
    axios
      .post("/pressKey", {
        key: command,
      })
      .then((response) => console.log(response.data))
      .catch((err) => console.log(`ActionCommand ERROR:${err}`));
  };

  const Speak = (response) => {
    axios
      .post("/speaking", {
        text: response,
      })
      .then((res) => {
        res.data === "ending process" ? window.close() : console.log(res.data);
      })
      .catch((err) => console.log(`SpeechSynthesis ERROR: ${err}`));
  };

  const SearchSong = (request) => {
    let SongNameList = [];
    let counter = 0;
    let checker = 1;

    request.forEach((word) => {
      if (word === "search" || word === "song" || word === "track") {
      } else if (word === " ") {
        checker = 2;
      } else {
        for (let c = 0; c <= word.length - 1; c++) {
          if (c === 0) SongNameList.push(word.charAt(0).toUpperCase());
          else {
            SongNameList.push(word.charAt(c));
          }
        }

        if (counter < request.length - 1 && counter > checker)
          SongNameList.push(" ");
      }

      counter += 1;
    });

    let songName = SongNameList.join("");

    if (songName === "Belt") songName = "Nur Noch Kurz Die Welt Retten";
    if (songName === "Kiss") songName = "Zou Bisou Bisou";
    if (songName === "for minutes") songName = "4 minutes";

    // let songArtist = RunTInfoFetcher(`osascript -e 'tell application "Music" to get artist of track "${songName}"'`)

    // Speak(`Playing ${songName} of ${songArtist}`)
    Speak(`Playing ${songName}`);

    RunTCommand(
      `osascript -e 'tell application "Music" to play track "${songName}"'`
    );
  };

  const SearchPlayList = (request) => {
    let PlaylistNumber = [];

    request.forEach((word) => {
      if (word === "search" || word === "playlist") {
      } else {
        PlaylistNumber.push(word);
      }
    });

    let DesiredPlaylist = PlaylistNumber.join("");

    switch (DesiredPlaylist) {
      case "working":
        Speak("Playing Playlist to Work");
        RunTCommand(
          `osascript -e 'tell app "Music" to play the playlist named "Arbeiten Musik"'`
        );
        break;
      case "pop":
        Speak("Playing Pop songs Playlist");
        RunTCommand(
          `osascript -e 'tell app "Music" to play the playlist named "Pop of Pop"'`
        );
        break;
      case "rock":
        Speak("Playing Playlist Rock Songs  ");
        RunTCommand(
          `osascript -e 'tell app "Music" to play the playlist named "Rock Biatch"'`
        );
        break;
      case "sad":
        Speak("Playing Playlist Sad Songs ");
        RunTCommand(
          `osascript -e 'tell app "Music" to play the playlist named "Laura Sad"'`
        );
        break;
      case "dancing":
        Speak("Playing Playlist Dancing Songs ");
        RunTCommand(
          `osascript -e 'tell app "Music" to play the playlist named "Para Bailar y Limpiar"'`
        );
        break;
      case "exercise" || "exercising":
        Speak("Playing Playlist to Exercise ");
        RunTCommand(
          `osascript -e 'tell app "Music" to play the playlist named "Insiprational Songs"'`
        );
        break;
      default:
        Speak("I didn't find such playlist");
    }
  };

  const SearchBand = (request) => {
    console.log("searching");

    let BandNameList = [];
    let counter = 0;
    let checker = 1;

    request.forEach((word) => {
      if (
        word === "search" ||
        word === "band" ||
        word === "track" ||
        word === "artist"
      ) {
      } else if (word === " ") {
        checker = 2;
      } else {
        for (let c = 0; c <= word.length - 1; c++) {
          if (c === 0) BandNameList.push(word.charAt(0).toUpperCase());
          else {
            BandNameList.push(word.charAt(c));
          }
        }

        if (counter < request.length - 1 && counter > checker)
          BandNameList.push(" ");
      }

      counter += 1;
    });

    let ArtistName = BandNameList.join("");

    Speak(`Reproducing songs by ${ArtistName}`);

    for (let c = 1; c < 15; c++) {
      RunTCommand(
        `osascript -e 'tell app "Music" to delete track 1 of playlist "Polymorph"'`
      );
    }
    for (let c = 1; c < 15; c++) {
      RunTCommand(
        `osascript -e 'tell app "Music" to duplicate track the name of (track ${c} whose artist is "${ArtistName}") to playlist "Polymorph"'`
      );
    }
  };

  const RepeatSongForever = (request) => {
    let SongNameList = [];
    let counter = 0;
    let checker = 1;

    request.forEach((word) => {
      if (
        word === "undefinetely" ||
        word === "song" ||
        word === "track" ||
        word === "forever" ||
        word === "repeat"
      ) {
      } else if (word === " ") {
        checker = 2;
      } else {
        for (let c = 0; c <= word.length - 1; c++) {
          if (c === 0) SongNameList.push(word.charAt(0).toUpperCase());
          else {
            SongNameList.push(word.charAt(c));
          }
        }

        if (counter < request.length - 1 && counter > checker)
          SongNameList.push(" ");
      }

      counter += 1;
    });

    let songName = SongNameList.join("");
    console.log(songName);

    Speak(`Repeating Forever, song: ${songName}`);

    for (let c = 1; c < 15; c++) {
      RunTCommand(
        `osascript -e 'tell app "Music" to delete track 1 of playlist "Polymorph"'`
      );
    }
    for (let c = 1; c < 15; c++) {
      RunTCommand(
        `osascript -e 'tell app "Music" to duplicate track "${songName}" to playlist "Polymorph"'`
      );
    }
  };

  const SetVolumeTo = (command, app) => {
    let VolumeLevelDesired = command[command.length - 1];

    if (VolumeLevelDesired === "five") VolumeLevelDesired = "5";
    if (VolumeLevelDesired === "ten") VolumeLevelDesired = "10";

    if (app === "general") {
      let FilteredVolLevel = VolumeLevelDesired;

      FilteredVolLevel = parseInt(FilteredVolLevel) || "NoNumberObtained";

      if (FilteredVolLevel === "NoNumberObtained") {
      } else {
        Speak(`Sound Level set to ${FilteredVolLevel}`);
        RunTCommand(
          `osascript -e "set volume output volume ${FilteredVolLevel}"`
        );
      }
    } else if (app === "itunes") {
      let FilteredVolLevel = VolumeLevelDesired;

      FilteredVolLevel = parseInt(FilteredVolLevel) || "NoNumberObtained";

      if (FilteredVolLevel === "NoNumberObtained") {
      } else {
        Speak(`Itunes sound level set to ${FilteredVolLevel}`);
        RunTCommand(
          `osascript -e 'tell app "Music" to set sound volume to ${FilteredVolLevel}'`
        );
      }
    }
  };

  const SayAJoke = () => {
    const jokeList = [
      "I invented a new word! I called it plagiarism",
      "Have you heard about the new restaurant called karma?. There's no menu, you get what you deserve",
      "Hey, did you hear about the claustrophobic astrounaut?. Yeah, he just needed a little space",
      "Do you know why scientists don't trust atoms?. Because they make everything up",
      "A man tells his doctor: Doc, help me I'm addicted to twitter. The doctor replies: Sorry I don't follow you",
      "What did the left eye say to the right eye?. Between you and me, something smells",
      "How do you throw a space party?. You just plan it.",
      "Where do you find a cow with no legs?. Right where you left it",
      "Why is 6 afraid of 7?. Beacuse 7,8,9",
      "How do trees go online?. They just log in",
    ];

    Speak(jokeList[Math.floor(Math.random() * jokeList.length)]);
  };

  useEffect(() => {
    const AIListenerEn = () => {
      var recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = true;

      let KeyWordHeard = false;
      let HandsFreeModeOn = false;
      let MusicModeOn = false;
      let CurrentState = "awaiting key name";
      let LastCommand = "none";
      // let SleepingState = false

      recognition.start();

      const BackGroundCheck = setInterval(() => {
        try {
          // console.log("AI restarted")
          recognition.start();
        } catch (error) {
          // console.error(error)
        }
      }, 10000);

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        let transcript = event.results[last][0].transcript;
        transcript = transcript.toLowerCase();
        let heard_my_name = false;
        let audio = transcript.split(" ");

        console.log(transcript);

        if (KeyWordHeard) {
          CurrentState = "awaiting command";

          if (
            (audio.includes("itunes") || audio.includes("music")) &&
            audio.includes("volume")
          ) {
            SetVolumeTo(audio, "itunes");
          }
          if (
            (audio.includes("general") || audio.includes("computer")) &&
            audio.includes("volume")
          ) {
            SetVolumeTo(audio, "general");
          }
          if (
            ((audio.includes("tell") && audio.includes("me")) ||
              (audio.includes("say") && audio.includes("a")) ||
              (audio.includes("tell") && audio.includes("a"))) &&
            audio.includes("joke")
          ) {
            SayAJoke();
          }
          if (audio.includes("screenshot")) {
            const randomGeneratedNumber = Math.floor(Math.random() * 10000000);
            RunTCommand(
              `screencapture ~/Desktop/Screenshots/meryScreenshots${randomGeneratedNumber}.jpg`
            );
          }

          if (audio.includes("next") && audio.includes("song")) {
            RunTCommand(
              "osascript -e 'tell application \"Music\" to next track'"
            );
          }
          if (audio.includes("previous") && audio.includes("song")) {
            RunTCommand(
              "osascript -e 'tell application \"Music\" to previous track'"
            );
          }
          if (audio.includes("repeat") && audio.includes("song")) {
            RunTCommand(
              "osascript -e 'tell application \"Music\" to back track'"
            );

            Speak("replaying song");
          }
          if (
            (audio.includes("stop") && audio.includes("song")) ||
            (audio.includes("pause") && audio.includes("song")) ||
            (audio.includes("stop") && audio.includes("music")) ||
            (audio.includes("pause") && audio.includes("music"))
          ) {
            RunTCommand("osascript -e 'tell application \"Music\" to pause'");
            Speak("Song ceased");
          }
          if (
            (audio.includes("resume") && audio.includes("music")) ||
            (audio.includes("play") && audio.includes("music")) ||
            (audio.includes("resume") && audio.includes("song")) ||
            (audio.includes("play") && audio.includes("song"))
          ) {
            RunTCommand("osascript -e 'tell application \"Music\" to play'");
            Speak("Reproducing");
          }

          if (
            ((audio.includes("stop") && audio.includes("video")) ||
              (audio.includes("pause") && audio.includes("video"))) &&
            LastCommand !== "stop video"
          ) {
            LastCommand = "stop video";
            Speak("Stopping");
            CPURemote("Press Space");
          }
          if (
            ((audio.includes("play") && audio.includes("video")) ||
              (audio.includes("resume") && audio.includes("video"))) &&
            LastCommand !== "play video"
          ) {
            LastCommand = "play video";
            Speak("Resuming");
            CPURemote("Press Space");
          }
          if (
            ((audio.includes("mute") && audio.includes("video")) ||
              (audio.includes("silence") && audio.includes("video"))) &&
            LastCommand !== "mute video"
          ) {
            LastCommand = "mute video";
            Speak("muting volume");
            CPURemote("Press M");
          }
          if (
            audio.includes("unmute") &&
            audio.includes("video") &&
            LastCommand !== "unmute video"
          ) {
            LastCommand = "unmute video";
            Speak("unmuting volume");
            CPURemote("Press M");
          }

          nameList.forEach((word) => {
            if (audio.includes(word)) Speak("Yes sir?");
            return;
          });

          if (HandsFreeModeOn) {
            CurrentState = "hands free mode state";

            if (
              (audio.includes("stop") || audio.includes("pause")) &&
              LastCommand !== "stop"
            ) {
              LastCommand = "stop";
              Speak("Stopping");
              CPURemote("Press Space");
            }
            if (
              (audio.includes("play") || audio.includes("resume")) &&
              LastCommand !== "play"
            ) {
              LastCommand = "play";
              Speak("Resuming");
              CPURemote("Press Space");
            }
            if (
              (audio.includes("mute") || audio.includes("silence")) &&
              LastCommand !== "mute"
            ) {
              LastCommand = "mute";
              Speak("muting volume");
              CPURemote("Press M");
            }
            if (audio.includes("unmute") && LastCommand !== "unmute") {
              LastCommand = "unmute";
              Speak("unmuting volume");
              CPURemote("Press M");
            }
            if (audio.includes("screen")) {
              if (audio.includes("full") && LastCommand !== "full") {
                LastCommand = "full";
                Speak("setting full screen");
                CPURemote("Press F");
              }

              if (audio.includes("small") && LastCommand !== "small") {
                LastCommand = "small";
                Speak("setting normal screen");
                CPURemote("Press F");
              }
            }
            if (audio.includes("exit")) {
              Speak("Exiting context");

              HandsFreeModeOn = false;
            }
          } else if (MusicModeOn) {
            CurrentState = "music mode state";

            if (audio.includes("next")) {
              RunTCommand(
                "osascript -e 'tell application \"Music\" to next track'"
              );
            }
            if (audio.includes("previous")) {
              RunTCommand(
                "osascript -e 'tell application \"Music\" to previous track'"
              );
            }
            if (audio.includes("repeat")) {
              if (audio.includes("undefinetely") || audio.includes("forever")) {
                RepeatSongForever(audio);
                RunTCommand(
                  `osascript -e 'tell app "Music" to play the playlist named "Polymorph"'`
                );
              } else {
                Speak("replaying song");
                RunTCommand(
                  "osascript -e 'tell application \"Music\" to back track'"
                );
              }
            }
            if (audio.includes("stop") || audio.includes("pause")) {
              RunTCommand("osascript -e 'tell application \"Music\" to pause'");
              Speak("Song ceased");
            }
            if (audio.includes("resume") || audio.includes("play")) {
              RunTCommand("osascript -e 'tell application \"Music\" to play'");
              Speak("Reproducing");
            }
            if (audio.includes("search")) {
              if (audio.includes("song") || audio.includes("track"))
                SearchSong(audio);
              if (audio.includes("playlist")) SearchPlayList(audio);
              if (audio.includes("band") || audio.includes("artist")) {
                SearchBand(audio);
                RunTCommand(
                  `osascript -e 'tell app "Music" to play the playlist named "Polymorph"'`
                );
              }
            }
            if (audio.includes("test")) {
              RunTInfoFetcher(
                `osascript -e 'tell application "Music" to get artist of track "I Need a Hero"'`
              );
            }
            if (audio.includes("exit") || audio.includes("thanks")) {
              Speak("Exiting Music Context");

              MusicModeOn = false;
            }
          } else {
            if (audio.includes("hands-free")) {
              Speak("Buffering up hands free mode");

              HandsFreeModeOn = true;
              // MusicModeOn = false
            }

            if (
              audio.includes("music") &&
              (audio.includes("mode") ||
                audio.includes("modality") ||
                audio.includes("mold") ||
                audio.includes("modes") ||
                audio.includes("note"))
            ) {
              Speak("Buffering up music modality");

              MusicModeOn = true;
              // HandsFreeModeOn = false
            }
            if (audio.includes("thanks") || audio.includes("nevermind")) {
              // console.log("sure thing");
              Speak("sure thing");
              KeyWordHeard = false;
            }
          }
        } else {
          CurrentState = "awaiting key name";
          nameList.forEach((word) => {
            if (audio.includes(word)) heard_my_name = true;
            return;
          });

          if (heard_my_name) {
            Speak("Yes sir?");
            KeyWordHeard = true;
          }
        }

        if (audio.includes("current") && audio.includes("state"))
          Speak(CurrentState);
        if (
          (audio.includes("quit") || audio.includes("exit")) &&
          audio.includes("app")
        )
          Speak("Ba Bye");
        if (
          (audio.includes("go") || audio.includes(" go")) &&
          audio.includes("to") &&
          audio.includes("sleep")
        ) {
          Speak("See you in a bit");
          console.log("Stopping MeryAI");
          KeyWordHeard = false;
          clearInterval(BackGroundCheck);
          setMuteButtonState(true);
          recognition.abort();
          return;
        }
      };
    };

    if (MuteButtonState === false) {
      console.log("Initialized MeryAI");
      AIListenerEn();
    }
  }, [MuteButtonState, nameList]);

  return (
    <div className="App">
      <div className="SvgBox">
        <BotAnim />
      </div>
      <div
        className="MuteButton"
        onClick={() => {
          setMuteButtonState(false);
          Speak("Hello sir");
        }}
        style={
          MuteButtonState
            ? { backgroundColor: "darkred" }
            : { backgroundColor: "#28FDBA" }
        }
      >
        <div
          className="Line"
          style={MuteButtonState ? { opacity: 1 } : { opacity: 0 }}
        ></div>
        <svg
          style={MuteButtonState ? { fill: "white" } : { fill: "black" }}
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 24 24"
        >
          <path d="M7.5 21c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-4.5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm8-12v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-4 2c0 2.209-1.791 4-4 4s-4-1.791-4-4v-7c0-2.209 1.791-4 4-4s4 1.791 4 4v7z" />
        </svg>
      </div>
      <div className="CloseButton" onClick={() => Speak("Ba Bye")}>
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 24 24"
        >
          <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
        </svg>
      </div>
    </div>
  );
}

export default App;
