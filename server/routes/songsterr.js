const Sentry = require('../sentry');
const axios = require("axios")
const songsterrRouter = require("express").Router()
const API = "https://www.songsterr.com/api/songs?pattern="
const spotifyApi = require("../spotifySetup")
const slowDown = require("express-slow-down")

const songsterrLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 10, // allow 5 requests to go at full-speed, effectively you can lookup 10 playlists. then...
    delayMs: 250 // 6th request has a 250ms delay, 7th has a 500ms delay, 8th gets 750ms, etc
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const getTabs = async tracks => {
    const tabs = []
    const newTracks = []
    const newArtists = []
    const artists = []
    let noGenres = false
    if (tracks[0].track) {
        for (track of tracks) {
            // Playlist
            newTracks.push(track.track)
        }
    } else {
        for (track of tracks) {
            // Album
            newTracks.push(track)
        }
    }
    for (track of newTracks) {
        if (!artists.find(x => x.name === track.artists[0].name.toLowerCase()))
            artists.push({
                name: track.artists[0].name.toLowerCase(),
                id: track.artists[0].id
            })
    }
    for (artist of artists) {
        const genres = []
        const genre = await spotifyApi.getArtist(artist.id)
        for (style of genre.body.genres) {
            if (!genres.find(genre => genre === style)) genres.push(style)
        }
        const i = artists.findIndex(x => x.id == artist.id)
        artists[i] = { ...artist, genres }
        if (genres.length === 0) {
            noGenres = true
        }
    }
    for (artist of artists) {
        for (g of artist.genres) {
            if (
                noGenres ||
                g.match(/rock/g) ||
                g.match(/metal/g) ||
                g.match(/thrash/g) ||
                g.match(/emo/g) ||
                g.match(/punk/g) ||
                g.match(/indie/g) ||
                g.match(/nu+gaze/g) ||
                g.match(/djent/g) ||
                g.match(/hardcore/g) ||
                g.match(/video game music/g) ||
                g.match(/jazz/g) ||
                g.match(/math/g)
            ) {
                if (!newArtists.find(x => x.id === artist.id)) newArtists.push(artist)
                console.log("YES: " + g)
            } else {
                console.log("NO: " + g)
            }
        }
    }
    console.log("~~~~~~")
    if (newArtists.length > 20) {
        return
    }
    for (artist of newArtists) {
        const response = await axios.get(API + artist.name + " " + "&size=200")
        for (tab of response.data) {
            for (track of newTracks) {
                if (tab.title.toLowerCase() === track.name.toLowerCase()) {
                    const obj = {
                        tab,
                        id: track.id
                    }
                    tabs.push(obj)
                }
            }
        }
        if (newArtists.length > 1) await sleep(500)
    }
    return tabs
}

songsterrRouter.post("/tracks/multiple", songsterrLimiter, async (req, res) => {
    try {
        const songsterrTabs = await getTabs(req.body)
        res.send(songsterrTabs)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(e.statusCode)
    }
})

module.exports = songsterrRouter
