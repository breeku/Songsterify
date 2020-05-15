import spotifyService from "../services/spotify"

const searchReducer = (state = null, action) => {
    if (action.type === "SET_RESULTS") {
        return action.data
    } else {
        return state
    }
}

export const searchSpotify = (obj) => {
    return async (dispatch) => {
        const response = await spotifyService.searchSpotify(obj)
        dispatch({
            type: "SET_RESULTS",
            data: response,
        })
    }
}

export default searchReducer
