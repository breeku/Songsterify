import React from "react"

import { makeStyles } from "@material-ui/core/styles"

import { Redirect } from "react-router-dom"

import { connect } from "react-redux"

import Hero from "./Hero/Hero"
import Intro from "./Intro/Intro"

const useStyles = makeStyles((theme) => ({
    root: theme.root,
    toolbar: theme.mixins.toolbar,
    content: theme.content,
}))

const Login = (props) => {
    const { tokens } = props
    const currentUrl = window.location.origin
    const classes = useStyles()
    const redirectUrl = currentUrl + "/callback/"
    const scopes = "&scope=user-read-recently-played%20user-top-read"
    const authUrl =
        "https://accounts.spotify.com/authorize?client_id=aef42b48cc74441299b7b1ac9b42a779&response_type=code&redirect_uri=" +
        redirectUrl +
        scopes
    return (
        <React.Fragment>
            {tokens && tokens.accessToken ? (
                <Redirect to="/" />
            ) : (
                <div className={classes.root}>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Hero authUrl={authUrl} />
                        <Intro />
                    </main>
                </div>
            )}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        tokens: state.tokens,
    }
}

const ConnectedLogin = connect(mapStateToProps, null)(Login)

export default ConnectedLogin
