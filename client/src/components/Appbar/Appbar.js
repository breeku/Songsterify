import React from "react"

import PlaylistList from "./PlaylistList"

import { Link } from "react-router-dom"

import { connect } from "react-redux"

import { withStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import List from "@material-ui/core/List"
import CssBaseline from "@material-ui/core/CssBaseline"
import Button from "@material-ui/core/Button"

import HomeIcon from "@material-ui/icons/Home"
import SearchIcon from "@material-ui/icons/Search"
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Cookies from 'js-cookie'

const drawerWidth = 300

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        backgroundColor: "transparent",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    a: {
        color: "whitesmoke",
        textDecoration: "none"
    },
    title: {
        flexGrow: 1
    },
})

const Appbar = props => {
    const { classes, tokens } = props

    const handleLogout = () => {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        window.location.href = "/"
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography
                            className={classes.title}
                            variant="h6"
                            noWrap
                        >
                            Songsterify
                        </Typography>
                        {tokens &&
                        tokens.accessToken ? (
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        ) : (
                            null
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    <Link className={classes.a} to="/">
                        <ListItem button disabled={tokens && tokens.accessToken ? false : true}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </Link>
                    <Link className={classes.a} to="/search/">
                        <ListItem button disabled={tokens && tokens.accessToken ? false : true}>
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText primary="Search" />
                        </ListItem>
                    </Link>
                    <Link className={classes.a} to="/about/">
                        <ListItem button>
                            <ListItemIcon>
                                <HelpOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary="About" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                    <PlaylistList />
            </Drawer>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        tokens: state.tokens
    }
}

const ConnectedAppbar = connect(
    mapStateToProps,
    null
)(Appbar)

export default withStyles(styles)(ConnectedAppbar)
