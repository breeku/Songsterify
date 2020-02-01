const Sentry = require('../sentry');
const authRouter = require("express").Router()
const spotifyApi = require('../spotifySetup')

/* istanbul ignore next */
authRouter.post("/login", async (req, res) => {
    try {
        let code = req.body.code
        const codeGrant = await spotifyApi.authorizationCodeGrant(code)
        
        res.cookie('accessToken', codeGrant.body["access_token"])
        res.cookie('refreshToken', codeGrant.body["refresh_token"], {httpOnly: true})
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(500)
    }
})

authRouter.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        await spotifyApi.setRefreshToken(refreshToken)
        const refreshedToken = await spotifyApi.refreshAccessToken()
        res.cookie('accessToken', refreshedToken.body["access_token"])
        res.sendStatus(201)
    } catch (e) {
        /* istanbul ignore next */
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(500)
    }
})

module.exports = authRouter
