import spotifyService from "../services/spotify";

const spotifyReducer = (state = null, action) => {
    if (action.type === "INIT_PLAYLISTS") {
        return action.data;
    } else {
        return state;
    }
};

export const initializePlaylists = (tokens) => {
    return async (dispatch) => {
        const playlists = await spotifyService.getPlaylists(tokens);
        dispatch({ type: "INIT_PLAYLISTS", data: playlists });
    };
};

export default spotifyReducer;
