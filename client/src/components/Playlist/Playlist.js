import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { withStyles } from "@material-ui/core/styles"

import TrackTable from "../Playlist&Album/TrackTable"
import PlaylistInfo from "./PlaylistInfo"
import SkeletonPlaylist from "../Skeletons/SkeletonPlaylist"

import getBackgroundColor from "../../utils/getBackgroundColor"

import {
    setBg,
    clearTracks,
    getTracks,
} from "../../reducers/trackReducer"

const styles = theme => ({
    root: {
        width: "100%",
        minHeight: "100vh"
    },
    content: {
        marginLeft: 300,
        paddingTop: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
})

const Playlist = props => {
    const [playlist, setPlaylist] = useState(null)
    const [bg, setBackground] = useState(
        "linear-gradient(rgb(56, 64, 103), rgb(6, 9, 10) 85%)"
    )
    const {
        classes,
        tokens,
        location,
        playlists,
        tracks,
        getTracks,
        setBg
    } = props

    const id = location.pathname.slice(10)

    useEffect(() => {
        if (tokens && tokens.accessToken) {
            if (!tracks || (tracks && !tracks[id])) {
                getTracks({
                    id,
                    accessToken: tokens.accessToken
                })
            }
        }
    }, [getTracks, id, tokens, tracks])

    useEffect(() => {
        if (tracks && tracks[id] && tracks[id].bg) {
            setBackground(tracks[id].bg)
        }
    }, [id, tracks])

    useEffect(() => {
        if (playlists && !location.state) {
            // linked from playlistlist
            setPlaylist(playlists.playlists.items.find(x => x.id === id))
        } else if (location && location.state) {
            // linked from tracktable link
            setPlaylist(location.state.playlist)
        } else {
            // linked from /browse/ or refreshed page of a album which does not exist in recent
            // fetch
        }
    }, [id, location, playlists])

    useEffect(() => {
        const setBackgroundColor = async () => {
            setBg({
                bg: await getBackgroundColor(playlist.images[0].url),
                id: playlist.id
            })
        }
        if (playlist && id && tracks && tracks[id] && !tracks[id].bg) {
            setBackgroundColor()
        }
    }, [id, playlist, setBg, tracks])

    return (
        <div
            className={classes.root}
            style={{
                backgroundImage: bg
            }}
        >
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div>
                    {playlist &&
                    playlist.id === id &&
                    tracks &&
                    tracks[id] &&
                    bg ? (
                        <React.Fragment>
                            <PlaylistInfo
                                playlist={playlist}
                                tracks={tracks[id]}
                            />
                            <TrackTable
                                playlist={playlist}
                                tracks={tracks[id]}
                            />
                        </React.Fragment>
                    ) : (
                        <SkeletonPlaylist />
                    )}
                </div>
            </main>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        playlists: state.playlists,
        tracks: state.tracks,
        tokens: state.tokens,
        albums: state.albums
    }
}

const ConnectedPlaylists = connect(
    mapStateToProps,
    { clearTracks, getTracks, setBg }
)(Playlist)

export default withRouter(withStyles(styles)(ConnectedPlaylists))
