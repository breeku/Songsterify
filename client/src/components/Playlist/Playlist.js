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

import { setAlbums } from "../../reducers/albumReducer"

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

const getBackgroundColor = async img => { // https://github.com/idanlo/react-spotify/blob/master/src/Components/PlaylistView/PlaylistView.jsx
    const palette = await Vibrant.from(img).getPalette()
    let rgb = palette.DarkMuted._rgb.join(", ")
    let color = "rgb(" + rgb + ")"
    let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`
    return bgImage
}

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
        albums,
        getAlbum,
        getTracks,
        setBg
    } = props
    const playlistType = props.playlist ? "playlist" : "album"

    let id = ""
    if (playlistType === "playlist") {
        id = location.pathname.slice(10)
    } else if (playlistType === "album") {
        id = location.pathname.slice(7)
    }

    useEffect(() => {
        if (tokens && tokens.accessToken) {
            if (playlistType === "album") {
                if (!tracks || (tracks && !tracks[id])) {
                    getAlbum({
                        id,
                        accessToken: tokens.accessToken
                    })
                }
            } else if (playlistType === "playlist") {
                if (!tracks || (tracks && !tracks[id])) {
                    getTracks({
                        id,
                        accessToken: tokens.accessToken
                    })
                }
            }
        }
    }, [getAlbum, getTracks, id, playlistType, tokens, tracks])

    useEffect(() => {
        if (tracks && tracks[id] && tracks[id].bg) {
            setBackground(tracks[id].bg)
        }
    }, [id, tracks])

    useEffect(() => {
        if (playlists && playlistType === "playlist") { // linked from playlistlist
            setPlaylist(playlists.playlists.items.find(x => x.id === id))
        } else if (albums && albums.recent && playlistType === "album" && !location.state) { // linked from recent albums
            setPlaylist(albums.recent[id])
        } else if (location && location.state && playlistType === "album") { // linked from tracktable link
            setPlaylist(location.state.album)
        } else { // linked from /browse/ or refreshed page of a album which does not exist in recent
            // fetch
        }
    }, [playlists, playlistType, id, albums, location])

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
    { clearTracks, getTracks, setBg, getAlbum, setAlbums }
)(Playlist)

export default withRouter(withStyles(styles)(ConnectedPlaylists))
