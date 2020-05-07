import React, { useState, useEffect } from "react"
import { connect } from "react-redux"

import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Box from "@material-ui/core/Box"

import { getTabs } from "../../reducers/trackReducer"
import { enqueueSnackbar, closeSnackbar } from "../../reducers/snackbarReducer"

const styles = (theme) => ({
    root: {},
    playlist: {
        paddingLeft: 20,
    },
    playlistPic: {
        maxWidth: 300,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);",
    },
    playlistInfo: {
        paddingLeft: 20,
    },
    text: {
        color: "whitesmoke",
    },
})

const Info = (props) => {
    const [loading, setLoading] = useState(false)
    const tracks = props.tracks.tracks.items
    const { type, playlist, classes, enqueueSnackbar, closeSnackbar } = props
    const { differentArtists, tabs } = props.tracks
    const artistLimit = 20

    const getTabs = async () => {
        props.getTabs({ tracks, id: playlist.id })
        setLoading(true)
    }

    useEffect(() => {
        if (tabs) {
            enqueueSnackbar({
                message:
                    "Found " +
                    tabs.length +
                    " tab" +
                    (tabs.length > 0
                        ? tabs.length === 1
                            ? "!"
                            : "s!"
                        : "s :("),
                options: {
                    key: new Date().getTime() + Math.random(),
                    autoHideDuration: 2500,
                    variant: tabs.length > 0 ? "success" : "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                    action: (key) => (
                        <Button onClick={() => closeSnackbar(key)}>
                            dismiss me
                        </Button>
                    ),
                },
            })
            setLoading(false)
        }
    }, [closeSnackbar, enqueueSnackbar, tabs])

    useEffect(() => {
        if (differentArtists > artistLimit) {
            enqueueSnackbar({
                message:
                    "Sorry! Your " +
                    (type === "playlist" ? "playlist" : "album") +
                    "'s artist count exceeds the current limit of " +
                    artistLimit,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                    action: (key) => (
                        <Button onClick={() => closeSnackbar(key)}>
                            dismiss me
                        </Button>
                    ),
                },
            })
        }
    }, [closeSnackbar, differentArtists, enqueueSnackbar, playlist, type])

    useEffect(() => {
        return () => {
            closeSnackbar()
        }
    }, [closeSnackbar])

    return (
        <React.Fragment>
            <Grid
                container
                direction="row"
                alignItems="center"
                className={classes.playlist}
            >
                <Grid item>
                    <Box height={300} width={300}>
                        <img
                            src={playlist.images[0].url}
                            className={classes.playlistPic}
                            alt={type === "playlist" ? "Playlist" : "Album"}
                        />
                    </Box>
                </Grid>
                <Grid item xs className={classes.playlistInfo}>
                    <h2 className={classes.text}>
                        {type === "playlist" ? "Playlist" : "Album"}
                    </h2>
                    <h1 className={classes.text}>{playlist.name}</h1>
                    <p className={classes.text}>
                        {type === "playlist" ? (
                            <React.Fragment>
                                Created by {playlist.owner.display_name},{" "}
                                {playlist.tracks.total} songs
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {playlist.total_tracks} songs
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
                                <CircularProgress size={26} color="secondary" />
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
        </React.Fragment>
    )
}

const connectedInfo = connect(null, {
    getTabs,
    enqueueSnackbar,
    closeSnackbar,
})(Info)

export default withStyles(styles)(connectedInfo)
