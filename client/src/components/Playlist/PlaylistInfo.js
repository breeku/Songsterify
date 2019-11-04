import React, { useState, useEffect } from "react"
import { connect } from "react-redux"

import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Box from "@material-ui/core/Box"

import Warning from "./Snackbars/Warning"

import { getTabs } from "../../reducers/trackReducer"

const styles = theme => ({
    root: {},
    playlist: {
        paddingLeft: 20
    },
    playlistPic: {
        maxWidth: 300,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);"
    },
    playlistInfo: {
        paddingLeft: 20
    },
    text: {
        color: "whitesmoke"
    }
})

const PlaylistInfo = props => {
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0);
    const tracks = props.tracks.tracks.items
    const { playlist } = props
    const { classes } = props
    const { album } = props.tracks
    const { tabs } = props.tracks
    const { differentArtists } = props.tracks
    const artistLimit = 15

    const getTabs = async () => {
        props.getTabs({ tracks, id: playlist.id })
        setLoading(true)
    }

    useEffect(() => {
        if (tabs) setLoading(false)
    }, [tabs])

    useEffect(() => {
        function tick() {
            // reset when reaching 100%
            setProgress(oldProgress => (oldProgress >= 100 ? 0 : oldProgress + 1));
          }
          const timer = setInterval(tick, 8 * differentArtists);
          return () => {
            clearInterval(timer);
          };
    }, [])

    return (
        <Grid
            container
            direction="row"
            alignItems="center"
            className={classes.playlist}
        >
            <Warning artistLimit={artistLimit} show={differentArtists > artistLimit}/>
            <Grid item>
                <Box height={300} width={300}>
                <img
                    src={playlist.images[0].url}
                    className={classes.playlistPic}
                    alt="Playlist"
                />
                </Box>
            </Grid>
            <Grid item xs className={classes.playlistInfo}>
                <h2 className={classes.text}>{album ? "Album" : "Playlist"}</h2>
                <h1 className={classes.text}>{playlist.name}</h1>
                <p className={classes.text}>
                    {album ? (
                        <React.Fragment>
                            {playlist.total_tracks} songs
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            Created by {playlist.owner.display_name},{" "}
                            {playlist.tracks.total} songs
                        </React.Fragment>
                    )}
                </p>
                {differentArtists < artistLimit && !tabs ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={getTabs}
                        style={{ minWidth: 99 }}
                    >
                        {!loading ? (
                            "Get Tabs"
                        ) : (
                            <CircularProgress variant="determinate" size={26} color="secondary" value={progress} />
                        )}
                    </Button>
                ) : (
                    <Button
                        disabled
                        variant="contained"
                        color="primary"
                        style={{ minWidth: 99 }}
                    >
                        Get Tabs
                    </Button>
                )}
            </Grid>
        </Grid>
    )
}

const connectedPlaylistInfo = connect(
    null,
    { getTabs }
)(PlaylistInfo)

export default withStyles(styles)(connectedPlaylistInfo)
