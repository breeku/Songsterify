import React from "react"
import { Link } from "react-router-dom"

import { withStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"

const styles = theme => ({
    a: {
        color: "whitesmoke",
        textDecoration: "none"
    },
    playlistPic: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);"
    }
})


const RecentTracks = props => {
    const { classes } = props
    const { tracks } = props.tracks
    return (
        <div style={{width: "100%"}}>
        <h1 style={{textAlign: "center"}}>Recently played</h1>
        <Grid container spacing={3} justify="center">
            {tracks.map(track => (
                <Grid item key={track.track.id}>
                    <Link className={classes.a} to={{pathname: "/playlist/" + track.track.album.id, state: {album: track.track.album}}}>
                        <img src={track.track.album.images[1].url} alt="album" className={classes.playlistPic}/>
                    </Link>
                </Grid>
            ))}
        </Grid>
        </div>
    )
}

export default withStyles(styles)(RecentTracks)