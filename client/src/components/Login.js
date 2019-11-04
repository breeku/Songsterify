import React from "react"
import Button from '@material-ui/core/Button';

import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        backgroundImage: "linear-gradient(rgb(58, 91, 95), rgb(6, 9, 10) 85%)",
        width: "100%",
        height: "100vh"
    },
    toolbar: theme.mixins.toolbar,
    content: {
        marginLeft: 300,
        flexGrow: 1,
        padding: theme.spacing(3),
        color: "whitesmoke"
    }
}))

const Login = () => {
    const classes = useStyles()
    const env = process.env.REACT_APP_DEV_CALLBACK
    let redirectUrl = ""
    if (env) {
        redirectUrl = env
    } else {
        redirectUrl = "https://songsterrify.herokuapp.com/callback/"
    }
    const scopes = "&scope=user-read-recently-played%20user-top-read"
    const authUrl =
        "https://accounts.spotify.com/authorize?client_id=aef42b48cc74441299b7b1ac9b42a779&response_type=code&redirect_uri=" +
        redirectUrl +
        scopes
    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container spacing={3} justify="center">
                    <Grid item>
                        <h1>Welcome to Songsterify!</h1>
                        <p>You will need to login to access the site.</p>
                        <Button href={authUrl} variant="contained" color="primary">Login via Spotify</Button>
                    </Grid>
                </Grid>
            </main>
        </div>
    )
}

export default Login
