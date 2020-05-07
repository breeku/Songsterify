import React, { useState } from "react"

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
import IconButton from "@material-ui/core/IconButton"
import Hidden from "@material-ui/core/Hidden"

import HomeIcon from "@material-ui/icons/Home"
import SearchIcon from "@material-ui/icons/Search"
import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import MenuIcon from "@material-ui/icons/Menu"

import Cookies from "js-cookie"

const drawerWidth = 300
const styles = theme => ({
    root: {
        flexGrow: 1
    },
    appBar: {
        backgroundColor: "transparent",
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth
        }
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0
        }
    },
    drawerPaper: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: drawerWidth
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    a: theme.aNoDecoration,
    title: {
        flexGrow: 1
    }
})

const Appbar = props => {
    const { classes, tokens } = props
    const [mobileOpen, setMobileOpen] = useState(false)

    const redirectUrl =
        "https://accounts.spotify.com/authorize?client_id=aef42b48cc74441299b7b1ac9b42a779&response_type=code&redirect_uri=http://localhost:3000/callback/&scope=user-read-recently-played%20user-top-read"

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleLogout = () => {
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        window.location.href = "/"
    }

    const drawer = (
        <React.Fragment>
            <Divider />
            <List>
                <Link
                    className={classes.a}
                    to={tokens && tokens.accessToken ? "/" : "/login"}
                >
                    <ListItem button>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                </Link>
                <Link
                    className={classes.a}
                    to={tokens && tokens.accessToken ? "/search/" : "/login"}
                >
                    <ListItem
                        button
                        disabled={tokens && tokens.accessToken ? false : true}
                    >
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
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <CssBaseline />
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            className={classes.title}
                            variant="h6"
                            noWrap
                        >
                            Songsterify
                        </Typography>
                        {tokens && tokens.accessToken ? (
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <Button color="inherit" href={redirectUrl}>
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            <nav className={classes.drawer} aria-label="playlist's">
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        anchor="left"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        anchor="left"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        tokens: state.tokens
    }
}

const ConnectedAppbar = connect(mapStateToProps, null)(Appbar)

export default withStyles(styles)(ConnectedAppbar)
