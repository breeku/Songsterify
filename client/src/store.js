import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"

import playlistReducer from "./reducers/playlistReducer"
import authReducer from "./reducers/authReducer"
import trackReducer from "./reducers/trackReducer"

const reducer = combineReducers({
    playlists: playlistReducer,
    tokens: authReducer,
    tracks: trackReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
