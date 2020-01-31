import React from "react"
import ReactDOM from "react-dom"
import store from "./store"
import App from "./App"
import { Provider } from "react-redux"
import { SnackbarProvider } from "notistack"

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider>
            <App />
        </SnackbarProvider>
    </Provider>,
    document.getElementById("root")
)

if (window.Cypress) {
    window.store = store
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
