import React, { useState } from "react"

import { connect } from "react-redux"

import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"

import AlbumGrid from "./AlbumGrid"
import ArtistGrid from "./ArtistGrid"
import PlaylistGrid from "./PlaylistGrid"

import { searchSpotify } from "../../reducers/searchReducer"

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
    },
    a: {
        color: "whitesmoke"
    },
    textField: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%"
    },
    playlistPic: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);"
    }
}))

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    }
}

const Search = props => {
    const { search, tokens, searchSpotify } = props
    const [formValue, setFormValue] = useState("")
    const [tabValue, setTabValue] = useState(0)
    const classes = useStyles()

    const formChange = e => {
        setFormValue(e.target.value)
    }

    const tabChange = (e, newValue) => {
        setTabValue(newValue)
    }

    const submitSearch = e => {
        e.preventDefault()
        searchSpotify({ value: formValue, accessToken: tokens.accessToken })
    }

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={e => submitSearch(e)}
                >
                    <TextField
                        id="filled-basic"
                        className={classes.textField}
                        label="Search"
                        margin="normal"
                        variant="filled"
                        autoFocus={true}
                        onChange={formChange}
                    />
                </form>
                <Paper square style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                    <Tabs
                        value={tabValue}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={tabChange}
                        aria-label="disabled tabs"
                        centered
                    >
                        <Tab
                            classes={{textColorSecondary: classes.a}}
                            label="Albums"
                            disabled={
                                search && search.albums.items.length > 0
                                    ? false
                                    : true
                            }
                            {...a11yProps(0)}
                        />
                        <Tab
                            classes={{textColorSecondary: classes.a}}
                            label="Artists"
                            disabled={
                                search && search.artists.items.length > 0
                                    ? false
                                    : true
                            }
                            {...a11yProps(1)}
                        />
                        <Tab
                            classes={{textColorSecondary: classes.a}}
                            label="Playlists"
                            disabled={
                                search && search.playlists.items.length > 0
                                    ? false
                                    : true
                            }
                            {...a11yProps(2)}
                        />
                        <Tab
                            classes={{textColorSecondary: classes.a}}
                            label="Tracks"
                            disabled={
                                search && search.tracks.items.length > 0
                                    ? false
                                    : true
                            }
                            {...a11yProps(3)}
                        />
                    </Tabs>
                </Paper>
                {search ? (
                    <React.Fragment>
                        <TabPanel value={tabValue} index={0}>
                            {search.albums ? (
                                <AlbumGrid
                                    albums={search.albums.items}
                                    classes={classes}
                                />
                            ) : null}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            {search.artists ? (
                                <ArtistGrid
                                    artists={search.artists.items}
                                    classes={classes}
                                />
                            ) : null}
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                            {search.playlists ? (
                                <PlaylistGrid
                                    playlists={search.playlists.items}
                                    classes={classes}
                                />
                            ) : null}
                        </TabPanel>
                    </React.Fragment>
                ) : null}
            </main>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        tokens: state.tokens,
        search: state.search
    }
}

const ConnectedSearch = connect(
    mapStateToProps,
    { searchSpotify }
)(Search)

export default ConnectedSearch
