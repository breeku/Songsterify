import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import playlistReducer from "./reducers/playlistReducer";
import authReducer from "./reducers/authReducer";
import trackReducer from "./reducers/trackReducer";
import albumReducer from "./reducers/albumReducer";
import snackbarReducer from "./reducers/snackbarReducer";
import searchReducer from "./reducers/searchReducer";
import userReducer from "./reducers/userReducer";

const reducer = combineReducers({
    playlists: playlistReducer,
    tokens: authReducer,
    tracks: trackReducer,
    albums: albumReducer,
    snackbars: snackbarReducer,
    search: searchReducer,
    user: userReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
