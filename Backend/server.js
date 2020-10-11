// const { json } = require("express")
// const mongoose = require("mongoose")
const path = require("path")
const express = require("express")
const cmd = require("node-cmd");
require("dotenv").config()


const app = express()
let port = process.env.PORT || 8000

let data = {
    action: "waiting for action"
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
