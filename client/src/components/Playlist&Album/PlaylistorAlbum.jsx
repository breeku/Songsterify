import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { withStyles } from "@material-ui/core/styles"

import TrackTable from "./TrackTable"
import Info from "./Info"
import SkeletonPlaylist from "../Skeletons/SkeletonPlaylist"

import getBackgroundColor from "../../utils/getBackgroundColor"

import {
    setBg,
    clearTracks,
    getTracks,
    getAlbum
} from "../../reducers/trackReducer"

const styles = theme => ({
    root: {
        ...theme.root,
        display: "block",
    },
    content: theme.content,
    toolbar: theme.mixins.toolbar
})

const PlaylistorAlbum = props => {
    const [playlist, setPlaylist] = useState(null)
    const [album, setAlbum] = useState(null)
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
        albums,
        getAlbum,
        setBg
    } = props

    const type =
        location.pathname.slice(1, 9) === "playlist" ? "playlist" : "album"

    const id =
        type === "playlist"
            ? location.pathname.slice(10)
            : location.pathname.slice(7)

    useEffect(() => {
        if (tokens && tokens.accessToken) {
            if (!tracks || (tracks && !tracks[id])) {
                if (type === "playlist") {
                    getTracks({
                        id,
                        accessToken: tokens.accessToken
                    })
                } else {
                    getAlbum({
                        id,
                        accessToken: tokens.accessToken
                    })
                }
            }
        }
    }, [getAlbum, getTracks, id, tokens, tracks, type])

    useEffect(() => {
        if (tracks && tracks[id] && tracks[id].bg) {
            setBackground(tracks[id].bg)
        }
    }, [id, tracks])

    useEffect(() => {
        if (type === "playlist") {
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
        } else {
            if (albums && albums.recent && !location.state) {
                // linked from recent albums
                setAlbum(albums.recent[id])
            } else if (location && location.state) {
                // linked from tracktable link
                setAlbum(location.state.album)
            } else {
                // linked from /browse/ or refreshed page of a album which does not exist in recent
                // fetch
            }
        }
    }, [albums, id, location, playlists, type])

    useEffect(() => {
        const setBackgroundColor = async () => {
            setBg({
                bg:
                    type === "playlist"
                        ? await getBackgroundColor(playlist.images[0].url)
                        : await getBackgroundColor(album.images[0].url),
                id: type === "playlist" ? playlist.id : album.id
            })
        }
        if (
            (album ||
            playlist) && id && tracks && tracks[id] && !tracks[id].bg
        ) {
            setBackgroundColor()
        }
    }, [album, id, playlist, setBg, tracks, type])

    return (
        <div
            className={classes.root}
            style={{
                backgroundImage: bg
            }}
        >
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <React.Fragment>
                        {((playlist &&
                        playlist.id === id) || 
                        (album && album.id === id)) &&
                        tracks &&
                        tracks[id] &&
                        bg ? (
                            <React.Fragment>
                                <Info
                                    type={type}
                                    playlist={type === "playlist" ? playlist : album}
                                    tracks={tracks[id]}
                                />
                                <TrackTable
                                    playlist={type === "playlist" ? playlist : album}
                                    tracks={tracks[id]}
                                />
                            </React.Fragment>
                        ) : (
                            <SkeletonPlaylist />
                        )}
                    </React.Fragment>
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

const ConnectedPlaylistorAlbum = connect(mapStateToProps, {
    clearTracks,
    getTracks,
    getAlbum,
    setBg
})(PlaylistorAlbum)

export default withRouter(withStyles(styles)(ConnectedPlaylistorAlbum))
