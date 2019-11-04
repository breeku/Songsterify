const Sentry = require('../sentry');
const spotifyRouter = require("express").Router()
const spotifyApi = require("../spotifySetup")

const refreshTokens = async refreshToken => {
    try {
        await spotifyApi.setRefreshToken(refreshToken)
        const refreshedToken = await spotifyApi.refreshAccessToken()
        await spotifyApi.setAccessToken(refreshedToken.body.access_token)
        console.log("tokens refreshed and set")
        return refreshedToken.body.access_token
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
    }
}

const getRecentTracks = async (accessToken, refreshToken) => {
    try {
        if (accessToken) await spotifyApi.setAccessToken(accessToken)
        const limit = 30
        const tracks = []
        const artists = []
        const response = await spotifyApi.getMyRecentlyPlayedTracks({limit})
        for (track of response.body.items) {
            if (artists.length === 0 || artists.length > 0 && !artists.includes(track.track.album.name)) {
                tracks.push(track)
                artists.push(track.track.album.name)
            }
        }
        return tracks
    } catch (e) {
        if (e.statusCode === 401 || e.statusCode === 400 || e.statusCode === 404) {
            let refreshedToken = await refreshTokens(refreshToken)
            return {refreshedToken}
        } else {
            console.log(e)
            Sentry.captureException(e);
        }
    }
}

const getAlbum = async (id, accessToken, refreshToken) => {
    try {
        if (accessToken) await spotifyApi.setAccessToken(accessToken)
        const tracks = await spotifyApi.getAlbumTracks(id)
        return tracks.body
    } catch (e) {
        if (e.statusCode === 401 || e.statusCode === 400 || e.statusCode === 404) {
            let refreshedToken = await refreshTokens(refreshToken)
            return {refreshedToken}
        } else {
            console.log(e)
            Sentry.captureException(e);
        }
    }
}

const getPlaylists = async (accessToken, refreshToken) => {
    try {
        if (accessToken) await spotifyApi.setAccessToken(accessToken)
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
    } catch (e) {
        if (e.statusCode === 401 || e.statusCode === 400 || e.statusCode === 404) {
            let refreshedToken = await refreshTokens(refreshToken)
            return {refreshedToken}
        } else {
            console.log(e)
            Sentry.captureException(e);
        }
    }
}

const getTracks = async (id, accessToken, refreshToken) => {
    try {
        if (accessToken) await spotifyApi.setAccessToken(accessToken)
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
    } catch (e) {
        if (e.statusCode === 401 || e.statusCode === 400 || e.statusCode === 404) {
            let refreshedToken = await refreshTokens(refreshToken)
            return {refreshedToken}
        } else {
            console.log(e)
            Sentry.captureException(e);
        }
    }
}

spotifyRouter.post("/playlists", async (req, res) => {
    try {
        const obj = {
            refreshedToken: null,
            playlists: null
        }
        let playlists = await getPlaylists(req.body.accessToken, req.body.refreshToken)
        if (playlists.refreshedToken) {
            obj.refreshedToken = playlists.refreshedToken
            playlists = await getPlaylists()
        }
        obj.playlists = playlists
        res.send(obj)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(500)
    }
})

spotifyRouter.post("/tracks", async (req, res) => {
    try {
        obj = {
            refreshedToken: null,
            tracks: null
        }
        let tracks = await getTracks(req.body.id, req.body.accessToken, req.body.refreshToken)
        if (tracks.refreshedToken) {
            obj.refreshedToken = tracks.refreshedToken
            tracks = await getTracks(req.body.id)
        }
        obj.tracks = tracks 
        res.send(obj)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(500)
    }
})

spotifyRouter.post("/tracks/recent", async (req, res) => {
    try {
        obj = {
            refreshedToken: null,
            tracks: null
        }
        let tracks = await getRecentTracks(req.body.accessToken, req.body.refreshToken)
        if (tracks.refreshedToken) {
            obj.refreshedToken = tracks.refreshedToken
            tracks = await getRecentTracks()
        }
        obj.tracks = tracks 
        res.send(obj)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(500)
    }
})

spotifyRouter.post("/album", async (req, res) => {
    try {
        obj = {
            refreshedToken: null,
            tracks: null,
            album: true
        }
        let tracks = await getAlbum(req.body.id, req.body.accessToken, req.body.refreshToken)
        if (tracks.refreshedToken) {
            obj.refreshedToken = tracks.refreshedToken
            tracks = await getAlbum(req.body.id)
        }
        obj.tracks = tracks 
        res.send(obj)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(500)
    }
})

module.exports = spotifyRouter
