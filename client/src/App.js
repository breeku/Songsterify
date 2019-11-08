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
import Tracks from "./components/Playlist/Playlist"
import Appbar from "./components/Appbar/Appbar"
import Warning from "./components/Snackbars/Warning"
import About from "./components/About/About"

import { getRecentAlbums } from "./reducers/albumReducer"
import { setToken } from "./reducers/authReducer"
import { initializePlaylists } from "./reducers/playlistReducer"

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
        main: () => <Tracks playlist />
    },
    {
        path: "/album/:id",
        main: () => <Tracks album />
    },
    {
        path: "/about/",
        exact: true,
        main: () => <About/>
    }
]

const App = props => {
    const {
        tokens,
        setToken,
        getRecentAlbums,
        albums,
        initializePlaylists,
        playlists
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

    const TokenRouting = () => {
        if (tokens) {
            if (tokens.accessToken) {
                return null
            } else {
                return <Redirect to="/login" />
            }
        }
        return null
    }

    return (
        <React.Fragment>
            <Router>
                <TokenRouting />
                <Appbar />
                <Warning />
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
        recent: state.recent
    }
}

const mapDispatchToProps = { setToken, getRecentAlbums, initializePlaylists }

const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default ConnectedApp
