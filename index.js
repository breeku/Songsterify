require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const rateLimit = require("express-rate-limit")
const app = express()
const authRouter = require("./server/routes/auth")
const spotifyRouter = require("./server/routes/spotify")
const songsterrRouter = require("./server/routes/songsterr")
const path = require("path")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})

app.set("trust proxy", 1)
app.use(limiter)

app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000
    })
)

app.use("/api/auth", authRouter)
app.use("/api/spotify", spotifyRouter)
app.use("/api/songsterr", songsterrRouter)

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
