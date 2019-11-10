import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Vibrant from "node-vibrant"

import { withStyles } from "@material-ui/core/styles"

import TrackTable from "../Playlist&Album/TrackTable"
import AlbumInfo from "./AlbumInfo"
import SkeletonPlaylist from "../Skeletons/SkeletonPlaylist"

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

const getBackgroundColor = async img => {
    // https://github.com/idanlo/react-spotify/blob/master/src/Components/PlaylistView/PlaylistView.jsx
    const palette = await Vibrant.from(img).getPalette()
    let rgb = palette.DarkMuted._rgb.join(", ")
    let color = "rgb(" + rgb + ")"
    let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`
    return bgImage
}

const Album = props => {
    const [album, setAlbum] = useState(null)
    const [bg, setBackground] = useState(
        "linear-gradient(rgb(56, 64, 103), rgb(6, 9, 10) 85%)"
    )
    const { classes, tokens, location, tracks, albums, getAlbum, setBg } = props

    const id = location.pathname.slice(7)

    useEffect(() => {
        if (tokens && tokens.accessToken) {
            if (!tracks || (tracks && !tracks[id])) {
                getAlbum({
                    id,
                    accessToken: tokens.accessToken
                })
            }
        }
    }, [getAlbum, id, tokens, tracks])

    useEffect(() => {
        if (tracks && tracks[id] && tracks[id].bg) {
            setBackground(tracks[id].bg)
        }
    }, [id, tracks])

    useEffect(() => {
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
    }, [albums, id, location])

    useEffect(() => {
        const setBackgroundColor = async () => {
            setBg({
                bg: await getBackgroundColor(album.images[0].url),
                id: album.id
            })
        }
        if (album && id && tracks && tracks[id] && !tracks[id].bg) {
            setBackgroundColor()
        }
    }, [album, id, setBg, tracks])

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
                    {album && album.id === id && tracks && tracks[id] && bg ? (
                        <React.Fragment>
                            <AlbumInfo album={album} tracks={tracks[id]} />
                            <TrackTable playlist={album} tracks={tracks[id]} />
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

const ConnectedAlbum = connect(
    mapStateToProps,
    { clearTracks, getTracks, setBg, getAlbum, setAlbums }
)(Album)

export default withRouter(withStyles(styles)(ConnectedAlbum))
