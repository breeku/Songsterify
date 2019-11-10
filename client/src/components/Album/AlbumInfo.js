import React, { useState, useEffect } from "react"
import { connect } from "react-redux"

import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Box from "@material-ui/core/Box"

import { getTabs } from "../../reducers/trackReducer"
import { setWarning } from "../../reducers/snackbarReducer"

const styles = theme => ({
    root: {},
    album: {
        paddingLeft: 20
    },
    albumPic: {
        maxWidth: 300,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);"
    },
    albumInfo: {
        paddingLeft: 20
    },
    text: {
        color: "whitesmoke"
    }
})

const AlbumInfo = props => {
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const tracks = props.tracks.tracks.items
    const { album, classes, setWarning } = props
    const { differentArtists, tabs } = props.tracks
    const artistLimit = 20

    const getTabs = async () => {
        props.getTabs({ tracks, id: album.id })
        setLoading(true)
    }

    useEffect(() => {
        if (tabs) setLoading(false)
    }, [tabs])

    useEffect(() => {
        if (differentArtists > artistLimit) {
            setWarning()
        }
    }, [differentArtists, setWarning])

    useEffect(() => {
        function tick() {
            // reset when reaching 100%
            setProgress(oldProgress =>
                oldProgress >= 100 ? 0 : oldProgress + 1
            )
        }
        const timer = setInterval(tick, 8 * differentArtists)
        return () => {
            clearInterval(timer)
        }
    }, [differentArtists])

    return (
        <Grid
            container
            direction="row"
            alignItems="center"
            className={classes.album}
        >
            <Grid item>
                <Box height={300} width={300}>
                    <img
                        src={album.images[0].url}
                        className={classes.albumPic}
                        alt="Album"
                    />
                </Box>
            </Grid>
            <Grid item xs className={classes.albumInfo}>
                <h2 className={classes.text}>Album</h2>
                <h1 className={classes.text}>{album.name}</h1>
                <p className={classes.text}>{album.total_tracks} songs</p>
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
                            <CircularProgress
                                variant="determinate"
                                size={26}
                                color="secondary"
                                value={progress}
                            />
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

const connectedAlbumInfo = connect(
    null,
    { getTabs, setWarning }
)(AlbumInfo)

export default withStyles(styles)(connectedAlbumInfo)
