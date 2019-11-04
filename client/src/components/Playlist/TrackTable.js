import React, { useState, useEffect } from "react"

import { Link } from "react-router-dom"

import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import List from "@material-ui/core/List"
import Button from "@material-ui/core/Button"
import { withStyles } from "@material-ui/core/styles"

import Tab from "./Tab/Tab"

const styles = theme => ({
    root: {
        marginTop: "1em",
        width: "100%"
    },
    text: {
        color: "whitesmoke"
    },
    row: {
        backgroundColor: "rgba(0,0,0,0)",
        transition: "all 1s"
    },
    tabFound: {
        backgroundColor: "rgba(0, 220, 0, 0.5)",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "rgba(0, 220, 0, 0.7)"
        }
    },
    tabNotFound: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.8)"
        }
    },
    a: {
        color: "whitesmoke",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline"
        }
    }
})

const millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const TrackTable = props => {
    const { classes } = props
    const album = props.tracks.album
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState(null)
    const [tabs, setTabs] = useState(null)
    let tracks = []

    useEffect(() => {
        setTabs(null)
        if (props.tracks && props.tracks.tabs) {
            setTabs(props.tracks.tabs)
        }
    }, [props.tracks, props.tracks.tabs])

    if (props.tracks && album) {
        tracks = props.tracks.tracks.items
    } else {
        for (const track of props.tracks.tracks.items) {
            tracks.push({ ...track.track })
        }
    }

    const rowStyling = track => {
        if (tabs) {
            if (tabs.find(x => x.id === track.id)) {
                return classes.tabFound
            } else {
                return classes.tabNotFound
            }
        } else {
            return {}
        }
    }

    const handleOpen = id => {
        setOpen(true)
        if (tabs) setTab(tabs.find(x => x.id === id))
    }

    const handleClose = () => {
        setOpen(false)
        setTab(null)
    }

    return (
        <React.Fragment>
            <Table className={classes.root}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.text}>#</TableCell>
                        <TableCell className={classes.text}>Title</TableCell>
                        <TableCell className={classes.text} align="right">
                            Artist
                        </TableCell>
                        <TableCell className={classes.text} align="right">
                            Album
                        </TableCell>
                        <TableCell className={classes.text} align="right">
                            Date added
                        </TableCell>
                        <TableCell className={classes.text} align="right">
                            Length
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <React.Fragment>
                        {tracks.map(track => (
                            <TableRow
                                key={track.id}
                                onClick={() => handleOpen(track.id)}
                                className={`${classes.row} ${rowStyling(
                                    track
                                )}`}
                            >
                                <TableCell
                                    align="left"
                                    className={classes.text}
                                >
                                    {track.track_number}
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className={classes.text}
                                >
                                    {track.name}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className={classes.text}
                                >
                                    {track.artists.map(artist => (
                                        <div key={artist.id}>{artist.name}</div>
                                    ))}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className={classes.text}
                                >
                                    {track.album ? (
                                        <Link
                                            className={classes.a}
                                            to={{
                                                pathname:
                                                    "/playlist/" +
                                                    track.album.id,
                                                state: { album: track.album }
                                            }}
                                        >
                                            {track.album.name}
                                        </Link>
                                    ) : null}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className={classes.text}
                                >
                                    {track.added_at}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className={classes.text}
                                >
                                    {millisToMinutesAndSeconds(track.duration_ms)} min
                                </TableCell>
                            </TableRow>
                        ))}
                    </React.Fragment>
                </TableBody>
            </Table>
            {tab ? (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth={"sm"}
                >
                    <DialogTitle
                        style={{ textAlign: "center" }}
                        id="alert-dialog-title"
                    >
                        {tab.tab.title}
                    </DialogTitle>
                    <DialogContent>
                        <Button
                            href={
                                "https://www.songsterr.com/a/wsa/" +
                                tab.tab.artist +
                                "-" +
                                tab.tab.title.replace(/\s/g, "-") +
                                "-tab-s" +
                                tab.tab.songId +
                                "t0"
                            }
                            target="!blank"
                            size="large"
                            variant="outlined"
                            color="primary"
                            fullWidth={true}
                        >
                            Open
                        </Button>
                        {tab.tab.tracks.map(track => (
                            <React.Fragment key={track.views}>
                                <Tab tab={track} />
                            </React.Fragment>
                        ))}
                    </DialogContent>
                </Dialog>
            ) : null}
        </React.Fragment>
    )
}

export default withStyles(styles)(TrackTable)
