import React from "react"
import { connect } from "react-redux"

import { makeStyles } from "@material-ui/core/styles"

import RecentAlbums from "./RecentAlbums"
import SkeletonRecentAlbums from "../Skeletons/SkeletonRecentAlbums"

const useStyles = makeStyles((theme) => ({
    root: theme.root,
    toolbar: theme.mixins.toolbar,
    content: theme.content,
}))

const Home = (props) => {
    const classes = useStyles()
    const { albums, user } = props

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {albums && user ? (
                    <React.Fragment>
                        <h2>Welcome {user.display_name}!</h2>
                        <RecentAlbums tracks={albums.recent} />
                    </React.Fragment>
                ) : (
                    <SkeletonRecentAlbums />
                )}
            </main>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        albums: state.albums,
        user: state.user,
    }
}

const ConnectedHome = connect(mapStateToProps, null)(Home)

export default ConnectedHome
