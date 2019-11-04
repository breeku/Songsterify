const Sentry = require('../sentry');
const authRouter = require("express").Router()
const spotifyApi = require('../spotifySetup')

authRouter.post("/", async (req, res) => {
    try {
        let code = req.body.code
        const codeGrant = await spotifyApi.authorizationCodeGrant(code)

        console.log("The token expires in " + codeGrant.body["expires_in"])
        console.log("The access token is " + codeGrant.body["access_token"])
        console.log("The refresh token is " + codeGrant.body["refresh_token"])

        const tokenInfo = {
            tokenExpires: codeGrant.body["expires_in"],
            accessToken: codeGrant.body["access_token"],
            refreshToken:  codeGrant.body["refresh_token"]
        }

        res.send(tokenInfo)
    } catch (e) {
        console.log(e)
        Sentry.captureException(e);
        res.sendStatus(500)
    }
})

module.exports = authRouter
