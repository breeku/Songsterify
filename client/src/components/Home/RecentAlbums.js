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


const RecentAlbums = props => {
    const { classes, tracks } = props

    return (
        <div style={{width: "100%"}}>
        <h1 style={{textAlign: "center"}}>Recently played</h1>
        <Grid container spacing={3} justify="center">
            {Object.keys(tracks).map(id => (
                <Grid item key={id}>
                    <Link className={classes.a} to={{pathname: "/album/" + tracks[id].id}}>
                        <img src={tracks[id].images[1].url} alt="album" className={classes.playlistPic}/>
                    </Link>
                </Grid>
            ))}
        </Grid>
        </div>
    )
}

export default withStyles(styles)(RecentAlbums)