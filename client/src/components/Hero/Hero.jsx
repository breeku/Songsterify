import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import createBreakpoints from "@material-ui/core/styles/createBreakpoints"

import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import Image from "../../media/site.png"

const breakpoints = createBreakpoints({})

const useStyles = makeStyles((theme) => ({
    hero: {
        backgroundImage:
            "linear-gradient(rgb(56, 64, 103), rgb(6, 9, 10) 175%)",
        borderRadius: "13px",
        boxShadow:
            "0 5px 10px rgba(0, 0, 0, 0.05), 0 15px 40px rgba(0, 0, 0, 0.2)",
        flexDirection: "row",
        [breakpoints.down("xs")]: {
            flexDirection: "column-reverse",
            paddingBottom: 15,
        },
    },
    image: {
        maxWidth: "100%",
    },
    item: {
        width: "50%",
        marginTop: "auto",
        marginBottom: "auto",
        [breakpoints.down("xs")]: {
            width: "100%",
        },
    },
    introduction: {
        textAlign: "center",
    },
}))

const Hero = (props) => {
    const { authUrl } = props
    const classes = useStyles()
    return (
        <Grid container className={classes.hero}>
            <Grid item className={classes.item}>
                <div className={classes.introduction}>
                    <h2 style={{ marginBottom: 0 }}>Welcome to</h2>
                    <h1 style={{ marginTop: 0 }}>Songsterify!</h1>
                    <p>You will need to login to access the site.</p>
                    <Button href={authUrl} variant="contained" color="primary">
                        Login via Spotify
                    </Button>
                </div>
            </Grid>
            <Grid item className={classes.item}>
                <img className={classes.image} src={Image}></img>
            </Grid>
        </Grid>
    )
}

export default Hero
