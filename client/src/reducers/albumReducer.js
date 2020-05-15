import spotifyService from "../services/spotify"

const albumReducer = (state = null, action) => {
    if (action.type === "GET_RECENT") {
        return { ...state, recent: action.data }
    } else {
        return state
    }
}

export const getRecentAlbums = (obj) => {
    return async (dispatch) => {
        const tracks = await spotifyService.getRecentTracks(obj)
        dispatch({ type: "GET_RECENT", data: tracks })
    }
}

export default albumReducer
