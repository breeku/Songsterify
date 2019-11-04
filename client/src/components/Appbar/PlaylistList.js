import React, { useEffect } from "react"

import { connect } from "react-redux"
import { Link } from "react-router-dom"

import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { withStyles } from "@material-ui/core/styles"

import Skeleton from '@material-ui/lab/Skeleton'

import { refreshToken } from "../../reducers/authReducer"
import { initializePlaylists } from "../../reducers/playlistReducer"

import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

const styles = theme => ({
    a: {
        color: "whitesmoke",
        textDecoration: "none"
    }
})

const SkeletonPlaylists = () => {
    return (
        <React.Fragment>
            <Skeleton variant="rect" width="100%" height="calc(100vh - 170px)"/>
        </React.Fragment>
    )
}

const PlaylistList = props => {
    const { classes } = props
    const { playlists } = props
    const { tokens } = props
    const { initializePlaylists } = props
    const { refreshToken } = props
    
    useEffect(() => {
        if (tokens && tokens.accessToken && tokens.refreshToken && !playlists) {
            initializePlaylists(tokens)
        }
        if (playlists) {
            if (playlists.refreshedToken && tokens.accessToken !== playlists.refreshedToken) {
                refreshToken(playlists.refreshedToken)
            }
        } 
    }, [tokens, playlists, initializePlaylists, refreshToken])

    return (
        <PerfectScrollbar
        >
            {playlists ? (
                <div style={{borderRight: "15px solid transparent"}}>
                    {playlists.playlists.items.map(list => (
                        <Link className={classes.a} to={"/playlist/" + list.id} key={list.id}>
                            <ListItem button>
                                {<ListItemText
                                    primary={list.name}
                                ></ListItemText>}
                            </ListItem>
                        </Link>
                    ))}
                </div>
            ) : (
                <React.Fragment>{tokens && tokens.accessToken ? <SkeletonPlaylists/> : null }</React.Fragment>
            )}
        </PerfectScrollbar>
    )
}

const mapStateToProps = state => {
    return {
        tokens: state.tokens,
        playlists: state.playlists,
    }
}

const ConnectedPlaylists = connect(
    mapStateToProps,
    { refreshToken, initializePlaylists }
)(PlaylistList)

export default withStyles(styles)(ConnectedPlaylists)
