import React from "react"
import { connect } from "react-redux"

import { makeStyles } from "@material-ui/core/styles"

import RecentAlbums from "./RecentAlbums"
import SkeletonRecentAlbums from "../Skeletons/SkeletonRecentAlbums"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        backgroundImage: "linear-gradient(rgb(56, 64, 103), rgb(6, 9, 10) 85%)",
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

const Home = props => {
    const classes = useStyles()
    const { albums, user } = props

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {albums && user ? (
                    <React.Fragment>
                        <h2>
                            Welcome {user.display_name}!
                        </h2>
                        <RecentAlbums tracks={albums.recent} />
                    </React.Fragment>
                ) : (
                    <SkeletonRecentAlbums />
                )}
            </main>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        albums: state.albums,
        user: state.user
    }
}

const ConnectedHome = connect(
    mapStateToProps,
    null
)(Home)

export default ConnectedHome
