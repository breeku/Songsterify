const snackbarReducer = (
    state = {
        notifications: []
    },
    action
) => {
    if (action.type === "ENQUEUE_SNACKBAR") {
        return {
            ...state,
            notifications: [
                ...state.notifications,
                {
                    key: action.key,
                    ...action.notification
                }
            ]
        }
    } else if (action.type === "CLOSE_SNACKBAR") {
        return {
            ...state,
            notifications: state.notifications.map(notification =>
                action.dismissAll || notification.key === action.key
                    ? { ...notification, dismissed: true }
                    : { ...notification }
            )
        }
    } else if (action.type === "REMOVE_SNACKBAR") {
        return {
            ...state,
            notifications: state.notifications.filter(
                notification => notification.key !== action.key
            )
        }
    } else {
        return state
    }
}

export const enqueueSnackbar = notification => {
    const key = notification.options && notification.options.key

    return async dispatch => {
        dispatch({
            type: "ENQUEUE_SNACKBAR",
            notification: {
                ...notification,
                key: key || new Date().getTime() + Math.random()
            }
        })
    }
}

export const closeSnackbar = key => {
    return async dispatch => {
        dispatch({
            type: "CLOSE_SNACKBAR",
            dismissAll: !key, // dismiss all if no key has been defined
            key
        })
    }
}

export const removeSnackbar = key => {
    return async dispatch => {
        dispatch({
            type: "REMOVE_SNACKBAR",
            key
        })
    }
}

export default snackbarReducer
