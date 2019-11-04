const authReducer = (state = null, action) => {
    if (action.type === "SET_TOKENS") {
        if (action.data.accessToken && action.data.refreshToken) {
            window.localStorage.setItem(
                "SongsterrifyTokens",
                JSON.stringify({
                    accessToken: action.data.accessToken,
                    refreshToken: action.data.refreshToken
                })
            )
        }
        return action.data
    } else if (action.type === "REFRESH_TOKEN") {
        window.localStorage.setItem(
            'SongsterrifyTokens', JSON.stringify({
                accessToken: action.data,
                refreshToken: state.refreshToken
            })
        )
        return {...state, accessToken: action.data}
    } else {
        return state
    }
}

export const setTokens = tokens => {
    if (tokens) {
        return async dispatch => {
            dispatch({
                type: "SET_TOKENS",
                data: tokens
            })
        }
    }
}

export const refreshToken = token => {
    if (token) {
        return async dispatch => {
            dispatch({
                type: "REFRESH_TOKEN",
                data: token
            })
        }
    }
}

export default authReducer