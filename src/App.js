// Libraries
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styling/css/App.min.css";

// Animation Components
import BotAnim from "./components/animations/Bot";

function App() {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();
  const speechRecognitionList = new (window.SpeechGrammarList ||
    window.webkitSpeechGrammarList)();

  const [MuteButtonState, setMuteButtonState] = useState(false);
  const [merySpokenText, setMerySpokenText] = useState("awaiting...");
  const [userSpokenText, setUserSpokenText] = useState("awaiting...");
  const [currentOptions, setCurrentOptions] = useState([]);
  let BackGroundCheck;

  const nameList = [
    "mery",
    "mary",
    "married",
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

  const StartStopBGCheck = (command) => {
    if (command === "start") {
      BackGroundCheck = setInterval(() => {
        try {
          console.log("AI restarted");
          recognition.start();
        } catch (error) {}
      }, 10000);
    } else {
      clearInterval(BackGroundCheck);
    }
  };

  const RunTCommand = (command) => {
    axios
      .post("/transcript", {
        action: command,
      })
      .then((response) => console.log(response.data))
      .catch((err) => console.log(`ActionCommand ERROR:${err}`));
  };

  const RunTInfoFetcher = (command) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/dataFetcher", {
          action: command,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          console.log(`ActionCommand ERROR:${err}`);
          reject(`ActionCommand ERROR:${err}`);
        });
    });
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
        setMerySpokenText(response);
        // console.log("stopped");
        recognition.stop();
        setTimeout(() => {
          try {
            recognition.start();
            // console.log("restarted");
          } catch (err) {
            // console.error("normal error, no biggie");
          }
        }, 2500);
      })
      .catch((err) => console.log(`SpeechSynthesis ERROR: ${err}`));
  };

  const SpeakRepeatedly = (responseList) => {
    console.log(responseList);
    setCurrentOptions(responseList);
    // clearInterval(BackGroundCheck);
    StartStopBGCheck("stop");
    recognition.stop();
    console.log("stopped recog");

    axios
      .post("/speaking", {
        text: "Select a command",
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(`SpeechSynthesis ERROR: ${err}`));

    setTimeout(() => {
      try {
        console.log("started recog");
        StartStopBGCheck("start");
        recognition.start();
      } catch (err) {}
    }, 2500 * (responseList.length + 1));

    responseList.forEach((response, index) => {
      setTimeout(() => {
        axios
          .post("/speaking", {
            text: response,
          })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(`SpeechSynthesis ERROR: ${err}`));
      }, 2500 * (index + 1));
    });
  };

  const SearchSong = async (request) => {
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

    const songArtist = await RunTInfoFetcher(
      `osascript -e 'tell application "Music" to get artist of track "${songName}"'`
    );

    if (songArtist.includes("error")) {
      Speak("I didn't find such song");
    } else {
      Speak(`Playing ${songName} by: ${songArtist}`);

      RunTCommand(
        `osascript -e 'tell application "Music" to play track "${songName}"'`
      );
    }
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

  const SearchBand = async (request) => {
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
    if (ArtistName === "rake" || ArtistName === "Rake") ArtistName = "reik";

    await RunTInfoFetcher(
      `osascript -e 'tell app "Music" to get the id of (track 1 whose artist is "${ArtistName}")'`
    ).then((responseData) => {
      if (responseData.toString().includes("error")) {
        Speak(`I didn't find such Artist`);
      } else {
        Speak(`Reproducing songs by ${ArtistName}`);

        const RefreshSongs = new Promise(async (resolve, reject) => {
          let loop1Done = false;
          let loop2Done = false;
          let insideCounter = 1;

          while (!loop1Done) {
            await RunTInfoFetcher(
              `osascript -e 'tell app "Music" to delete track 1 of playlist "Polymorph"'`
            ).then((responseData) => {
              if (responseData.includes("error")) loop1Done = true;
            });
          }

          while (!loop2Done) {
            await RunTInfoFetcher(
              `osascript -e 'tell app "Music" to duplicate track the name of (track ${insideCounter} whose artist is "${ArtistName}") to playlist "Polymorph"'`
            ).then((responseData) => {
              if (responseData.includes("error")) loop2Done = true;
              insideCounter++;
            });
          }

          resolve("Done Searching");
        });

        RefreshSongs.then(() => {
          RunTCommand(
            `osascript -e 'tell app "Music" to play the playlist named "Polymorph"'`
          );
        });
      }
    });
  };

  const RepeatSongForever = async (request) => {
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

    const songArtist = await RunTInfoFetcher(
      `osascript -e 'tell application "Music" to get artist of track "${songName}"'`
    );

    if (songArtist.includes("error")) {
      Speak("I didn't find such song");
    } else {
      Speak(`Repeating Forever, song: ${songName}, by: ${songArtist}`);

      const RefreshSongs = new Promise(async (resolve, reject) => {
        let loop1Done = false;

        while (!loop1Done) {
          await RunTInfoFetcher(
            `osascript -e 'tell app "Music" to delete track 1 of playlist "Polymorph"'`
          ).then((responseData) => {
            if (responseData.includes("error")) loop1Done = true;
          });
        }

        for (let c = 1; c < 15; c++) {
          await RunTInfoFetcher(
            `osascript -e 'tell app "Music" to duplicate track "${songName}" to playlist "Polymorph"'`
          );
        }

        resolve("Done Searching");
      });

      RefreshSongs.then(() => {
        RunTCommand(
          `osascript -e 'tell app "Music" to play the playlist named "Polymorph"'`
        );
      });
    }
  };

  const RepeatBandForever = async (request) => {
    let BandNameList = [];
    let counter = 0;
    let checker = 1;

    request.forEach((word) => {
      if (
        word === "undefinetely" ||
        word === "songs" ||
        word === "track" ||
        word === "forever" ||
        word === "by" ||
        word === "repeat"
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

    let bandName = BandNameList.join("");
    if (bandName === "rake" || bandName === "Rake") bandName = "reik";

    await RunTInfoFetcher(
      `osascript -e 'tell app "Music" to duplicate track the name of (track 1 whose artist is "${bandName}")'`
    ).then((responseData) => {
      if (responseData.includes("error")) {
        Speak(`I didn't find such Artist`);
      } else {
        Speak(`Repeating Forever, songs by: ${bandName}`);

        const RefreshSongs = new Promise(async (resolve, reject) => {
          let loop1Done = false;
          let loop2Done = false;
          let insideCounter = 1;
          let multiplyingFactor = 2;
          let loopTracker = 1;

          await RunTInfoFetcher(
            `osascript -e 'tell app "Music" to get the id of (every track whose artist is "${bandName}")'`
          ).then((responseData) => {
            const trackList = responseData.split(",");
            trackList >= 4 ? (multiplyingFactor = 2) : (multiplyingFactor = 3);
          });

          while (!loop1Done) {
            await RunTInfoFetcher(
              `osascript -e 'tell app "Music" to delete track 1 of playlist "Polymorph"'`
            ).then((responseData) => {
              if (responseData.includes("error")) loop1Done = true;
            });
          }

          while (!loop2Done) {
            await RunTInfoFetcher(
              `osascript -e 'tell app "Music" to duplicate track the name of (track ${insideCounter} whose artist is "${bandName}") to playlist "Polymorph"'`
            ).then((responseData) => {
              if (responseData.includes("error")) {
                if (loopTracker === insideCounter * multiplyingFactor) {
                  loop2Done = true;
                } else {
                  insideCounter = 0;
                }
              }
              insideCounter++;
              loopTracker++;
            });
          }

          resolve("Done Searching");
        });

        RefreshSongs.then(() => {
          RunTCommand(
            `osascript -e 'tell app "Music" to play the playlist named "Polymorph"'`
          );
        });
      }
    });
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

  const DecreaseIncreaseCurrentVolume = async (type, request) => {
    const currentVolumeData = await RunTInfoFetcher(
      "osascript -e 'get volume settings'"
    );

    const optimizedCurrentVolumeData = currentVolumeData.split("");
    let volumeFound = false;
    let processDone = false;
    let volAmountFound = false;
    let filteredVolumeList = [];
    let filteredRequestVolume = [];

    optimizedCurrentVolumeData.forEach((letter) => {
      if (processDone) {
      } else {
        if (volumeFound) {
          if (letter === ",") {
            processDone = true;
          } else {
            filteredVolumeList.push(letter);
          }
        } else {
          if (letter === ":") {
            volumeFound = true;
          } else {
          }
        }
      }
    });

    request.forEach((word) => {
      if (volAmountFound) {
        filteredRequestVolume.push(word);
      } else {
        if (word === "by") {
          volAmountFound = true;
        }
      }
    });

    const volAmount = parseInt(filteredRequestVolume.join("").trim());
    const filteredVolume = parseInt(filteredVolumeList.join(""));

    if (type === "getCurrent") {
      Speak(`Current volume: ${filteredVolume}`);
    } else {
      if (volAmount) {
        if (type === "increase") {
          Speak(`Sound Level set to ${filteredVolume + volAmount}`);
          RunTCommand(
            `osascript -e "set volume output volume ${
              filteredVolume + volAmount
            }"`
          );
        } else if (type === "decrease") {
          Speak(`Sound Level set to ${filteredVolume - volAmount}`);
          RunTCommand(
            `osascript -e "set volume output volume ${
              filteredVolume - volAmount
            }"`
          );
        }
      } else {
        if (type === "increase") {
          Speak(`Sound Level set to ${filteredVolume + 10}`);
          RunTCommand(
            `osascript -e "set volume output volume ${filteredVolume + 10}"`
          );
        } else if (type === "decrease") {
          Speak(`Sound Level set to ${filteredVolume - 10}`);
          RunTCommand(
            `osascript -e "set volume output volume ${filteredVolume - 10}"`
          );
        }
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
      const grammar =
        "#JSGF V1.0; grammar names; public <name> = " +
        nameList.join(" | ") +
        " ;";

      speechRecognitionList.addFromString(grammar, 1);

      recognition.grammars = speechRecognitionList;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = true;
      recognition.maxAlternatives = 3;

      let KeyWordHeard = false;
      let HandsFreeModeOn = false;
      let MusicModeOn = false;
      let CurrentState = "awaiting key name";
      let LastCommand = "none";

      recognition.start();

      StartStopBGCheck("start");

      recognition.onresult = (event) => {
        let MostRealiableTranscript = "awaiting...";
        const TranscriptRealiabilitylist = [];

        const last = event.results.length - 1;
        for (let c = 0; c <= event.results[last].length - 1; c++) {
          TranscriptRealiabilitylist.push(event.results[last][c].confidence);
        }

        MostRealiableTranscript =
          event.results[last][
            TranscriptRealiabilitylist.indexOf(
              Math.max.apply(null, TranscriptRealiabilitylist)
            )
          ].transcript.toLowerCase();
        let heard_my_name = false;
        let audio = MostRealiableTranscript.split(" ");

        setUserSpokenText(MostRealiableTranscript);

        if (CurrentState === "Choosing a command option") {
          CurrentState = "awaiting command";
          KeyWordHeard = true;
          if (audio.includes("first")) {
            audio = currentOptions[0]?.split(" ") | currentOptions[0];
          } else if (audio.includes("second")) {
            audio = currentOptions[1].split(" ");
          } else if (audio.includes("third")) {
            audio = currentOptions[2].split(" ");
          } else {
            audio = audio;
          }
        }

        console.log(currentOptions[0]);
        console.log(audio);

        if (KeyWordHeard) {
          CurrentState = "awaiting command";

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
                if (audio.includes("songs") || audio.includes("by")) {
                  RepeatBandForever(audio);
                } else {
                  RepeatSongForever(audio);
                }
              } else {
                Speak("replaying song");
                RunTCommand(
                  "osascript -e 'tell application \"Music\" to back track'"
                );
              }
            }
            if (
              audio.includes("stop") ||
              audio.includes("pause") ||
              audio.includes("cease")
            ) {
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
              }
            }
            if (audio.includes("exit") || audio.includes("thanks")) {
              Speak("Exiting Music Context");

              MusicModeOn = false;
            }
          } else {
            if (audio.includes("classroom")) {
              Speak("testing worked");
            } else if (
              (audio.includes("itunes") || audio.includes("music")) &&
              audio.includes("volume")
            ) {
              SetVolumeTo(audio, "itunes");
            } else if (
              (audio.includes("general") || audio.includes("computer")) &&
              audio.includes("volume")
            ) {
              SetVolumeTo(audio, "general");
            } else if (audio.includes("volume")) {
              if (audio.includes("increase") || audio.includes("raise")) {
                DecreaseIncreaseCurrentVolume("increase", audio);
              } else if (
                audio.includes("decrease") ||
                audio.includes("lower")
              ) {
                DecreaseIncreaseCurrentVolume("decrease", audio);
              } else if (audio.includes("current")) {
                DecreaseIncreaseCurrentVolume("getCurrent", audio);
              }
            } else if (
              ((audio.includes("tell") && audio.includes("me")) ||
                (audio.includes("say") && audio.includes("a")) ||
                (audio.includes("tell") && audio.includes("a"))) &&
              audio.includes("joke")
            ) {
              SayAJoke();
            } else if (audio.includes("screenshot")) {
              const randomGeneratedNumber = Math.floor(
                Math.random() * 10000000
              );
              RunTCommand(
                `screencapture ~/Desktop/Screenshots/meryScreenshots${randomGeneratedNumber}.jpg`
              );
            } else if (audio.includes("next") && audio.includes("song")) {
              RunTCommand(
                "osascript -e 'tell application \"Music\" to next track'"
              );
            } else if (audio.includes("previous") && audio.includes("song")) {
              RunTCommand(
                "osascript -e 'tell application \"Music\" to previous track'"
              );
            } else if (audio.includes("repeat") && audio.includes("song")) {
              RunTCommand(
                "osascript -e 'tell application \"Music\" to back track'"
              );

              Speak("replaying song");
            } else if (
              (audio.includes("stop") && audio.includes("song")) ||
              (audio.includes("pause") && audio.includes("song")) ||
              (audio.includes("stop") && audio.includes("music")) ||
              (audio.includes("cease") && audio.includes("music")) ||
              (audio.includes("case") && audio.includes("song")) ||
              (audio.includes("pause") && audio.includes("music"))
            ) {
              RunTCommand("osascript -e 'tell application \"Music\" to pause'");
              Speak("Song ceased");
              KeyWordHeard = false;
            } else if (
              (audio.includes("resume") && audio.includes("music")) ||
              (audio.includes("play") && audio.includes("music")) ||
              (audio.includes("resume") && audio.includes("song")) ||
              (audio.includes("play") && audio.includes("song"))
            ) {
              RunTCommand("osascript -e 'tell application \"Music\" to play'");
              Speak("Reproducing");
              KeyWordHeard = false;
            } else if (
              ((audio.includes("stop") && audio.includes("video")) ||
                (audio.includes("pause") && audio.includes("video"))) &&
              LastCommand !== "stop video"
            ) {
              LastCommand = "stop video";
              Speak("Stopping");
              CPURemote("Press Space");
            } else if (
              ((audio.includes("play") && audio.includes("video")) ||
                (audio.includes("resume") && audio.includes("video"))) &&
              LastCommand !== "play video"
            ) {
              LastCommand = "play video";
              Speak("Resuming");
              CPURemote("Press Space");
            } else if (
              ((audio.includes("mute") && audio.includes("video")) ||
                (audio.includes("silence") && audio.includes("video"))) &&
              LastCommand !== "mute video"
            ) {
              LastCommand = "mute video";
              Speak("muting volume");
              CPURemote("Press M");
            } else if (
              audio.includes("unmute") &&
              audio.includes("video") &&
              LastCommand !== "unmute video"
            ) {
              LastCommand = "unmute video";
              Speak("unmuting volume");
              CPURemote("Press M");
            } else if (audio.includes("hands-free")) {
              Speak("Buffering up hands free mode");

              HandsFreeModeOn = true;
            } else if (
              audio.includes("music") &&
              (audio.includes("mode") ||
                audio.includes("modality") ||
                audio.includes("mold") ||
                audio.includes("modes") ||
                audio.includes("note"))
            ) {
              Speak("Buffering up music modality");

              MusicModeOn = true;
            } else if (
              audio.includes("thanks") ||
              audio.includes("nevermind") ||
              audio.includes("nvm") ||
              (audio.includes("never") && audio.includes("mind"))
            ) {
              Speak("sure thing");
              KeyWordHeard = false;
            } else {
              let thingy = true;

              nameList.forEach((word) => {
                if (audio.includes(word)) {
                  Speak("Yes Sir?");
                  thingy = false;
                }
              });

              if (thingy) {
                if (LastCommand === "Choosing a command option") {
                  Speak("No such command");
                  LastCommand = "awaiting...";
                } else {
                  const transcriptsList = [];
                  TranscriptRealiabilitylist.forEach((transcript) => {
                    transcriptsList.push(
                      event.results[last][
                        TranscriptRealiabilitylist.indexOf(transcript)
                      ].transcript.toLowerCase()
                    );
                  });
                  SpeakRepeatedly(transcriptsList);
                  CurrentState = "Choosing a command option";
                  LastCommand = "Choosing a command option";
                }
              }
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
          StartStopBGCheck("stop");
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
  }, [setMuteButtonState]);

  return (
    <div className="App">
      <div className="SvgBox">
        <BotAnim />
      </div>
      <p className="userInput">{userSpokenText}</p>
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
