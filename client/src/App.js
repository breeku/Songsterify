import React, { useEffect } from "react"
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from "react-router-dom"
import { connect } from "react-redux"

import Main from "./components/Main"
import Callback from "./components/Callback"
import Login from "./components/Login"
import Tracks from "./components/Playlist/Playlist"
import Appbar from "./components/Appbar/Appbar"

import { setTokens } from "./reducers/authReducer"
import { CircularProgress } from "@material-ui/core"

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
        main: () => <Tracks />
    }
]

const App = props => {
    useEffect(() => {
        if (!props.tokens) {
            const tokenJSON = window.localStorage.getItem("SongsterrifyTokens")
            if (tokenJSON) {
                props.setTokens(JSON.parse(tokenJSON))
            } else {
                props.setTokens({
                    accessToken: null,
                    refreshToken: null
                })
            }
        }
    }, [props, props.tokens])

    const TokenRouting = () => {
        if (props.tokens) {
            if (props.tokens.accessToken || props.tokens.refreshToken) {
                // accesstoken changes when refreshing token
                return <Redirect to="/" />
            } else {
                return <Redirect to="/login" />
            }
        }
        return <CircularProgress />
    }

    return (
        <React.Fragment>
            <Router>
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
        playlists: state.playlists
    }
}

const mapDispatchToProps = { setTokens }

const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default ConnectedApp
