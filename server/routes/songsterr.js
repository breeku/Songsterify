const Sentry = require('../sentry');
const axios = require("axios")
const songsterrRouter = require("express").Router()
const API = "https://www.songsterr.com/api/songs?pattern="
const spotifyApi = require("../spotifySetup")
const slowDown = require("express-slow-down")

const debug = {data: [{"artist":"Ensiferum","title":"Victory Song (All)","songId":89420,"artistId":2100,"defaultTrack":4,"tracks":[{"tuning":[64,59,55,50,45,40],"instrumentId":116,"views":0},{"tuning":[64,59,55,50,45,40],"instrumentId":52,"views":0},{"tuning":[64,59,55,50,45,40],"instrumentId":73,"views":4},{"tuning":[64,59,55,50,45,40],"instrumentId":46,"views":0},{"difficulty":"BELOW_INTERMEDIATE","tuning":[64,59,55,50,45,40],"difficultyV3":"BELOW_INTERMEDIATE","difficultyVersion":3,"instrumentId":30,"views":170},{"difficulty":"BELOW_INTERMEDIATE","tuning":[64,59,55,50,45,40],"difficultyV3":"EASY","difficultyVersion":3,"instrumentId":30,"views":8},{"tuning":[48,43,38,33,28,23],"instrumentId":33,"views":4},{"instrumentId":1024,"views":0}]},{"artist":"Ensiferum","title":"Victory Song","songId":34167,"artistId":2100,"defaultTrack":0,"tracks":[{"difficulty":"INSANE","tuning":[64,59,55,50,45,40],"difficultyV3":"INSANE","difficultyVersion":3,"instrumentId":30,"views":4},{"difficulty":"VERY_EASY","tuning":[64,59,55,50,45,40],"difficultyV3":"VERY_EASY","difficultyVersion":3,"instrumentId":30,"views":1}]},{"artist":"Sing Praises To Jehovah","title":"The Victory Song","songId":76049,"artistId":15267,"defaultTrack":0,"tracks":[{"difficulty":"VERY_EASY","tuning":[64,59,55,50,45,40],"difficultyV3":"VERY_EASY","difficultyVersion":3,"instrumentId":25,"views":1},{"difficulty":"VERY_EASY","tuning":[64,59,55,50,45,40],"difficultyV3":"VERY_EASY","difficultyVersion":3,"instrumentId":25,"views":0}]},{"artist":"Tomahawk","title":"Song Of Victory","songId":56804,"artistId":11537,"defaultTrack":0,"tracks":[{"difficulty":"INTERMEDIATE","tuning":[64,59,55,50,45,40],"difficultyV3":"INTERMEDIATE","difficultyVersion":3,"instrumentId":25,"views":0}]},{"artist":"Weezer","title":"Teenage Victory Song","songId":21770,"artistId":200,"defaultTrack":0,"tracks":[{"difficulty":"VERY_EASY","tuning":[64,59,55,50,45,40],"difficultyV3":"VERY_EASY","difficultyVersion":3,"instrumentId":29,"views":0},{"difficulty":"VERY_EASY","tuning":[64,59,55,50,45,40],"difficultyV3":"VERY_EASY","difficultyVersion":3,"instrumentId":29,"views":0},{"difficulty":"VERY_EASY","tuning":[64,59,55,50,45,40],"difficultyV3":"VERY_EASY","difficultyVersion":3,"instrumentId":30,"views":0},{"tuning":[43,38,33,28],"instrumentId":34,"views":0},{"tuning":[64,59,55,50,45,40],"instrumentId":71,"views":0},{"tuning":[64,59,55,50,45,40],"instrumentId":71,"views":0},{"tuning":[64,59,55,50,45,40],"instrumentId":52,"views":0},{"instrumentId":1024,"views":0}]}]}

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
                g.match(/nu gaze/g) ||
                g.match(/djent/g) ||
                g.match(/hardcore/g) ||
                g.match(/video game music/g) ||
                g.match(/jazz/g)
            ) {
                if (!newArtists.find(x => x.id === artist.id))
                    newArtists.push(artist)
            }
        }
    }
    if (newArtists.length >= 15) {
        return
    }
    for (artist of newArtists) {
        //console.log("looking up " + artist.name)
        //const response = debug
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
        await sleep(500)
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
        res.sendStatus(500)
    }
})

module.exports = songsterrRouter
