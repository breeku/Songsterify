import spotifyService from "../services/spotify";
import songsterrService from "../services/songsterr";

const trackReducer = (state = null, action) => {
    if (action.type === "GET_TRACKS") {
        return {
            ...state,
            [action.id]: {
                ...action.data,
                differentArtists: action.differentArtists,
            },
        };
    } else if (action.type === "CLEAR_TRACKS") {
        return null;
    } else if (action.type === "SET_BG") {
        const prevTracks = state[action.id];
        const newTracks = { ...prevTracks, bg: action.bg };
        return { ...state, [action.id]: newTracks };
    } else if (action.type === "GET_TABS") {
        const prevTracks = state[action.id];
        const newTracks = { ...prevTracks, tabs: action.data };
        return { ...state, [action.id]: newTracks };
    } else {
        return state;
    }
};

export const getTracks = (obj) => {
    return async (dispatch) => {
        const tracks = await spotifyService.getTracks(obj);
        const differentArtists = [];
        for (const x of tracks.tracks.items) {
            const name = x.track.artists[0].name;
            if (!differentArtists.find((x) => x === name))
                differentArtists.push(name);
        }
        dispatch({
            type: "GET_TRACKS",
            data: tracks,
            id: obj.id,
            differentArtists: differentArtists.length,
        });
    };
};

export const getTabs = (obj) => {
    return async (dispatch) => {
        const tabs = await songsterrService.getTabs(obj.tracks);
        dispatch({ type: "GET_TABS", data: tabs, id: obj.id });
    };
};

export const clearTracks = () => {
    return async (dispatch) => {
        dispatch({ type: "CLEAR_TRACKS" });
    };
};

export const setBg = (obj) => {
    return async (dispatch) => {
        dispatch({ type: "SET_BG", bg: obj.bg, id: obj.id });
    };
};

export const getAlbum = (obj) => {
    return async (dispatch) => {
        const tracks = await spotifyService.getAlbum(obj);
        const differentArtists = [];
        for (const x of tracks.tracks.items) {
            const name = x.artists[0].name;
            if (!differentArtists.find((x) => x === name))
                differentArtists.push(name);
        }
        dispatch({
            type: "GET_TRACKS",
            data: tracks,
            id: obj.id,
            differentArtists: differentArtists.length,
        });
    };
};

export default trackReducer;
