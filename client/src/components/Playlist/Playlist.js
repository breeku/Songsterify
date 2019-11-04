import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Vibrant from "node-vibrant"

import { withStyles } from "@material-ui/core/styles"

import TrackTable from "./TrackTable"
import PlaylistInfo from "./PlaylistInfo"
import SkeletonPlaylist from "./Skeleton/SkeletonPlaylist"

import {
    setBg,
    clearTracks,
    getTracks,
    getAlbum
} from "../../reducers/trackReducer"
import { refreshToken } from "../../reducers/authReducer"

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

const getBackgroundColor = async img => {
    const palette = await Vibrant.from(img).getPalette()
    let rgb = palette.DarkMuted._rgb.join(", ")
    let color = "rgb(" + rgb + ")"
    let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`
    return bgImage
}

const Playlist = props => {
    const id = props.location.pathname.slice(10)
    const [playlist, setPlaylist] = useState(null)
    const [bg, setBackground] = useState(
        "linear-gradient(rgb(58, 91, 95), rgb(6, 9, 10) 85%)"
    )
    const { classes } = props
    const { tokens } = props
    const { location } = props
    const { playlists } = props
    const { tracks } = props
    const { refreshToken } = props
    const { getAlbum } = props
    const { getTracks } = props
    const { setBg } = props

    useEffect(() => {
        if (
            tokens &&
            tokens.accessToken &&
            tokens.refreshToken &&
            location.state &&
            location.state.album &&
            tracks &&
            !tracks[id]
        ) {
            getAlbum({
                id,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            })
        } else if (
            (tokens &&
                tokens.accessToken &&
                tokens.refreshToken &&
                playlists &&
                !tracks) ||
            (tokens &&
                tokens.accessToken &&
                tokens.refreshToken &&
                tracks &&
                !tracks[id])
        ) {
            getTracks({
                id,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            })
        }
    }, [getAlbum, getTracks, id, location.state, playlists, tokens, tracks])

    useEffect(() => {
        if (tracks && tracks[id]) {
            if (
                tracks[id].refreshedToken &&
                tokens.accessToken !== tracks[id].refreshedToken
            ) {
                refreshToken(tracks[id].refreshedToken)
            }
            if (tracks[id] && tracks[id].bg) {
                setBackground(tracks[id].bg)
            }
        }
        if (playlists && !location.state) {
            setPlaylist(playlists.playlists.items.find(x => x.id === id))
        } else if (location.state) {
            setPlaylist(location.state.album)
        }
    }, [
        tracks,
        id,
        playlists,
        location.state,
        tokens,
        refreshToken
    ]) // not optimal, need to include id for "offline" and tracks for online

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

    useEffect(() => {
        return () => {
        }
    }, [])

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
                    {playlist && playlist.id === id && tracks && tracks[id] && bg ? (
                        <React.Fragment>
                            <PlaylistInfo
                                playlist={playlist}
                                tracks={tracks[id]}
                            />
                            <TrackTable tracks={tracks[id]} />
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
        tokens: state.tokens
    }
}

const ConnectedPlaylists = connect(
    mapStateToProps,
    { clearTracks, getTracks, refreshToken, setBg, getAlbum }
)(Playlist)

export default withRouter(withStyles(styles)(ConnectedPlaylists))
