const snackbarReducer = (state = {warning: false}, action) => {
    if (action.type === "SET_WARNING") {
        return {warning: !state.warning}
    } else {
        return state
    }
}

export const setWarning = () => {
    return async dispatch => {
        dispatch({ type: "SET_WARNING"})
    }
}

export default snackbarReducer