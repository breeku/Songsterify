import React from "react"
import ReactDOM from "react-dom"
import store from "./store"
import App from "./App"
import { Provider } from "react-redux"
import { SnackbarProvider } from "notistack"
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({})

const theme = createMuiTheme({
    root: {
        maxWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        backgroundImage: "linear-gradient(rgb(56, 64, 103), rgb(6, 9, 10) 85%)"
    },
    content: {
        marginLeft: 300,
        flexGrow: 1,
        padding: "1em",
        color: "whitesmoke",
        [breakpoints.down('xs')]: {
            marginLeft: 0,
        }
    },
    aNoDecoration: {
        color: "whitesmoke",
        textDecoration: "none"
    }
  });

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <App />
            </SnackbarProvider>
        </ThemeProvider>
    </Provider>,
    document.getElementById("root")
)

if (window.Cypress) {
    window.store = store
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
