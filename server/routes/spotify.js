const Sentry = require("../sentry")
const spotifyRouter = require("express").Router()
const spotifyApi = require("../spotifySetup")

const getRecentTracks = async accessToken => {
    await spotifyApi.setAccessToken(accessToken)
    const limit = 30
    const artists = []
    let tracks = {}
    const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit })
    for (track of response.body.items) {
        if (
            artists.length === 0 ||
            (artists.length > 0 && !artists.includes(track.track.album.name))
        ) {
            tracks = {...tracks, [track.track.album.id]: track.track.album}
            artists.push(track.track.album.name)
        }
    }
    return tracks
}

const getAlbum = async (id, accessToken) => {
    await spotifyApi.setAccessToken(accessToken)
    const tracks = await spotifyApi.getAlbumTracks(id)
    return tracks.body
}

const getPlaylists = async accessToken => {
    await spotifyApi.setAccessToken(accessToken)
    let limit = 50
    let offset = 0
    const currentUser = await spotifyApi.getMe()
    let playlists = await spotifyApi.getUserPlaylists(
        currentUser.body.display_name,
        { limit }
    )

    while (offset < playlists.body.total) {
        offset += 50
        const next = await spotifyApi.getUserPlaylists(
            currentUser.body.display_name,
            { limit, offset }
        )
        for (playlist of next.body.items) {
            playlists.body.items.push(playlist)
        }
    }
    return playlists.body
}

const getTracks = async (id, accessToken) => {
    await spotifyApi.setAccessToken(accessToken)
    let offset = 100
    let tracks = await spotifyApi.getPlaylistTracks(id)
    while (offset < tracks.body.total) {
        const next = await spotifyApi.getPlaylistTracks(id, { offset })
        for (track of next.body.items) {
            tracks.body.items.push(track)
        }
        offset += 100
    }
    return tracks.body
}

const Search = async (value, accessToken) => {
    await spotifyApi.setAccessToken(accessToken)
    const results = await spotifyApi.search(value, ['album', 'artist', 'playlist', 'track'])
    return results.body
}

spotifyRouter.post("/playlists", async (req, res) => {
    try {
        const playlists = await getPlaylists(req.body.accessToken)
        res.send({ playlists })
    } catch (e) {
        console.log(e)
        Sentry.captureException(e)
        res.sendStatus(e.statusCode)
    }
})

spotifyRouter.post("/tracks", async (req, res) => {
    try {
        const tracks = await getTracks(req.body.id, req.body.accessToken)
        res.send({ tracks })
    } catch (e) {
        console.log(e)
        Sentry.captureException(e)
        res.sendStatus(e.statusCode)
    }
})

spotifyRouter.post("/tracks/recent", async (req, res) => {
    try {
        const tracks = await getRecentTracks(req.body.accessToken)
        res.send(tracks)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e)
        res.sendStatus(e.statusCode)
    }
})

spotifyRouter.post("/album", async (req, res) => {
    try {
        obj = {
            tracks: null,
            album: true
        }
        let tracks = await getAlbum(req.body.id, req.body.accessToken)
        obj.tracks = tracks
        res.send(obj)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e)
        res.sendStatus(e.statusCode)
    }
})

spotifyRouter.post("/search", async (req, res) => {
    try {
        const results = await Search(req.body.value, req.body.accessToken)
        res.send(results)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e)
        res.sendStatus(e.statusCode)
    }
})

module.exports = spotifyRouter
