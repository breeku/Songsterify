import { useEffect } from "react"
import { useSnackbar } from "notistack"
import { removeSnackbar } from "../../reducers/snackbarReducer"

import { connect } from "react-redux"

let displayed = []

const Notifier = props => {
    const { notifications } = props.snackbars
    const { removeSnackbar } = props
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const storeDisplayed = id => {
        displayed = [...displayed, id]
    }

    const removeDisplayed = id => {
        displayed = [...displayed.filter(key => id !== key)]
    }

    useEffect(() => {
        notifications.forEach(
            ({ key, message, options = {}, dismissed = false }) => {
                if (dismissed) {
                    // dismiss snackbar using notistack
                    closeSnackbar(key)
                    return
                }

                // do nothing if snackbar is already displayed
                if (displayed.includes(key)) return

                // display snackbar using notistack
                enqueueSnackbar(message, {
                    key,
                    ...options,
                    onClose: (event, reason, myKey) => {
                        if (options.onClose) {
                            options.onClose(event, reason, myKey)
                        }
                    },
                    onExited: (event, myKey) => {
                        // removen this snackbar from redux store
                        removeSnackbar(myKey)
                        removeDisplayed(myKey)
                    }
                })

                // keep track of snackbars that we've displayed
                storeDisplayed(key)
            }
        )
    }, [notifications, closeSnackbar, enqueueSnackbar, removeSnackbar])

    return null
}

const mapStateToProps = state => {
    return {
        snackbars: state.snackbars
    }
}

const mapDispatchToProps = {
    removeSnackbar
}

const ConnectedNotifier = connect(mapStateToProps, mapDispatchToProps)(Notifier)

export default ConnectedNotifier
