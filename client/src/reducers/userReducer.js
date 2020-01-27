import spotifyService from "../services/spotify"

const userReducer = (state = null, action) => {
    if (action.type === "SET_USER") {
        return action.data
    } else {
        return state
    }
}

export const getUser = obj => {
    return async dispatch => {
        const response = await spotifyService.getUser(obj)
        dispatch({ type: "SET_USER", data: response })
    }
}

export default userReducer