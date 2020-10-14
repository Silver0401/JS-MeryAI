// const { json } = require("express")
// const mongoose = require("mongoose")
const path = require("path")
const express = require("express")
const cmd = require("node-cmd");

const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

require("dotenv").config()
const app = express()
let port = process.env.PORT || 8000


let data = {
    action: "waiting for action"
}

let info = {
    text: "waiting for utterance"
}

app.use(express.json())

// BackEnd and FrontEnd Connections

if (process.env.APP_STATE === "prod") {

    app.use(express.static(path.resolve(__dirname, "./../build")))

    app.get("*/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./../build", "index.html"))
    })

} else {

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/backendTemplate.html")
    })
}

// Testing Stuff

app.get("/transcript", (req,res) => {
    res.json(data)
}) 

app.post("/transcript", (req,res) => {

    data = {
        action: req.body.action
    }

    res.send("action recieved, initializing...")

    if (data.action !== "waiting for action") {
        cmd.run(data.action);
    }
})


app.post("/speaking", (req,res) => {
    
    info = {
        text: req.body.text
    }

    if (info.text !== "waiting for utterance"){

        res.send(`text to speak received, buffering...`);
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        async function quickStart() {
        // The text to synthesize
        const text = info.text;
    
        // Construct the request
        const request = {
            input: { text: text },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: "en-GB", ssmlGender: "FEMENINE" },
            // select the type of audio encoding
            audioConfig: { audioEncoding: "MP3" },
        };
    
        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile("output.mp3", response.audioContent, "binary");
        // console.log("Audio content written to file: output.mp3");
        cmd.run("afplay output.mp3");
        }
    
        
        quickStart();
    } else {
        res.send(`something went terribly wrong, this is the text obtained: ${info.text}`);
    }

})

// Mongo Data Base Connection

// mongoose.connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })
// const dataBase = mongoose.connection
// dataBase.on("error", error => console.log(error))
// dataBase.once("open", () => console.log("Connected to MongooseDB"))

// Port Listening

app.listen(port, () => console.log(`App server initalized on port ${port}`))
