import React, {useEffect} from "react"
import { connect } from "react-redux"

import { makeStyles } from "@material-ui/core/styles"

import { getRecentTracks } from "../reducers/trackReducer"

import RecentTracks from "./RecentTracks"
import SkeletonRecentTracks from "./SkeletonRecent"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        backgroundImage: "linear-gradient(rgb(58, 91, 95), rgb(6, 9, 10) 85%)",
        width: "100%",
        minHeight: "100vh"
    },
    toolbar: theme.mixins.toolbar,
    content: {
        marginLeft: 300,
        flexGrow: 1,
        padding: theme.spacing(3),
        color: "whitesmoke"
    }
}))

const Main = props => {
    const classes = useStyles()
    const { tokens } = props
    const { tracks } = props
    const { getRecentTracks } = props

    useEffect(() => {
        if (tokens && tokens.accessToken && tokens.refreshToken && !tracks) {
            getRecentTracks({accessToken: tokens.accessToken, refreshToken: tokens.refreshToken})
        }
    }, [getRecentTracks, tokens, tracks])

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {tracks && tracks.recent ? <RecentTracks tracks={tracks.recent}/> : <SkeletonRecentTracks/>}
            </main>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        tokens: state.tokens,
        tracks: state.tracks
    }
}

const ConnectedMain = connect(
    mapStateToProps,
    { getRecentTracks }
)(Main)

export default ConnectedMain
