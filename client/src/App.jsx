import React, { useEffect } from "react"
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from "react-router-dom"
import { connect } from "react-redux"

import Main from "./components/Home/Home"
import Callback from "./components/Callback"
import Login from "./components/Login"
import PlaylistorAlbum from "./components/Playlist&Album/PlaylistorAlbum"
import Appbar from "./components/Appbar/Appbar"
import About from "./components/About/About"
import Search from "./components/Search/Search"
import Notifier from "./components/Notifier/Notifier"

import { getRecentAlbums } from "./reducers/albumReducer"
import { setToken } from "./reducers/authReducer"
import { initializePlaylists } from "./reducers/playlistReducer"
import { getUser } from "./reducers/userReducer"

const routes = [
    {
        path: "/",
        exact: true,
        main: () => <Main />
    },
    {
        path: "/login/",
        exact: true,
        main: () => <Login />
    },
    {
        path: "/callback/",
        main: () => <Callback />
    },
    {
        path: "/playlist/:id",
        main: () => <PlaylistorAlbum />
    },
    {
        path: "/album/:id",
        main: () => <PlaylistorAlbum />
    },
    {
        path: "/about/",
        exact: true,
        main: () => <About />
    },
    {
        path: "/search/",
        exact: true,
        main: () => <Search />
    }
]

const App = props => {
    const {
        tokens,
        setToken,
        getRecentAlbums,
        albums,
        initializePlaylists,
        playlists,
        user,
        getUser
    } = props

    useEffect(() => {
        if (!tokens) {
            setToken()
        }
    }, [setToken, tokens])

    useEffect(() => {
        if (tokens && tokens.accessToken && !albums) {
            getRecentAlbums({ accessToken: tokens.accessToken })
        }
    }, [albums, getRecentAlbums, tokens])

    useEffect(() => {
        if (tokens && tokens.accessToken && !playlists) {
            initializePlaylists(tokens)
        }
    }, [initializePlaylists, playlists, tokens])

    useEffect(() => {
        if (tokens && tokens.accessToken && !user) {
            getUser({ accessToken: tokens.accessToken })
        }
    }, [getUser, user, tokens])

    const TokenRouting = () => {
        if (tokens) {
            if (tokens.accessToken) {
                return null
            } else if (tokens.accessToken === null) {
                return <Redirect to="/login" />
            }
        }
        return null
    }

    return (
        <React.Fragment>
            <Router>
                <Notifier/>
                <TokenRouting />
                <Appbar />
                <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            children={route.main}
                        />
                    ))}
                </Switch>
            </Router>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        tokens: state.tokens,
        playlists: state.playlists,
        recent: state.recent,
        albums: state.albums,
        user: state.user
    }
}

const mapDispatchToProps = {
    setToken,
    getRecentAlbums,
    initializePlaylists,
    getUser
}

const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default ConnectedApp
