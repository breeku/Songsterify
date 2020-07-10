import React from "react"

import { makeStyles } from "@material-ui/core/styles"

import Grid from "@material-ui/core/Grid"

import getTabsImage from "../../media/gettabs.png"
import tabImage from "../../media/tab.png"

const useStyles = makeStyles((theme) => ({
    intro: {
        marginTop: "20vh",
    },
    image: {
        maxWidth: "100%",
        boxShadow:
            "0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(0, 0, 0, 0.2)",
    },
    item: {
        width: "50%",
        marginTop: "auto",
        marginBottom: "auto",
    },
    introduction: {
        textAlign: "center",
        maxWidth: "75%",
        margin: "0 auto",
    },
}))

const Intro = (props) => {
    const classes = useStyles()
    return (
        <Grid container direction="row" className={classes.intro}>
            <Grid item className={classes.item}>
                <div className={classes.introduction}>
                    <h2>What is it?</h2>
                    <p>
                        Songsterify combines Songsterr and Spotify to make it
                        easy to find new songs to play! Browse your favourite
                        playlists / albums and discover tabs that you did not
                        know exist.
                    </p>
                </div>
            </Grid>
            <Grid item className={classes.item}>
                <img
                    className={classes.image}
                    style={{ float: "left" }}
                    src={getTabsImage}
                ></img>
                <img
                    className={classes.image}
                    style={{ float: "right" }}
                    src={tabImage}
                ></img>
            </Grid>
        </Grid>
    )
}

export default Intro
