import Cookies from 'js-cookie'

const authReducer = (state = null, action) => {
    if (action.type === "SET_TOKEN") {
        return action.data
    } else if (action.type === "REFRESH_TOKEN") {
        return action.data
    } else {
        return state
    }
}

export const setToken = () => {
        return async dispatch => {
            const accessToken = Cookies.get('accessToken')
            if (accessToken) {
                dispatch({
                    type: "SET_TOKEN",
                    data: {accessToken}
                })
            } else {
                dispatch({
                    type: "SET_TOKEN",
                    data: {accessToken: null}
                })
            }
        }
}

export const refreshToken = token => {
    return async dispatch => {
        dispatch({
            type: "REFRESH_TOKEN",
            data: {accessToken: token}
        })
    }
}

export default authReducer