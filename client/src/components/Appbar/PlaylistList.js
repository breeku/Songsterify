import React from "react"

import { connect } from "react-redux"
import { Link } from "react-router-dom"

import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { withStyles } from "@material-ui/core/styles"

import SkeletonPlaylists from "../Skeletons/SkeletonPlaylists"

import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"

const styles = theme => ({
    a: {
        color: "whitesmoke",
        textDecoration: "none"
    }
})

const PlaylistList = props => {
    const { classes, playlists, tokens } = props

    return (
        <PerfectScrollbar>
            {playlists ? (
                <div style={{ borderRight: "15px solid transparent" }}>
                    {playlists.playlists.items.map(list => (
                        <Link
                            className={classes.a}
                            to={"/playlist/" + list.id}
                            key={list.id}
                        >
                            <ListItem button>
                                {
                                    <ListItemText
                                        primary={list.name}
                                    ></ListItemText>
                                }
                            </ListItem>
                        </Link>
                    ))}
                </div>
            ) : (
                <React.Fragment>
                    {tokens && tokens.accessToken ? (
                        <SkeletonPlaylists />
                    ) : null}
                </React.Fragment>
            )}
        </PerfectScrollbar>
    )
}

const mapStateToProps = state => {
    return {
        tokens: state.tokens,
        playlists: state.playlists
    }
}

const ConnectedPlaylists = connect(
    mapStateToProps,
    null
)(PlaylistList)

export default withStyles(styles)(ConnectedPlaylists)
