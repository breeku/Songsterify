import axios from "axios"
import { refresh } from "./auth"
import Cookies from "js-cookie"
import store from "../store"
const baseUrl = "/api/spotify/"

let authTokenRequest;

// This function makes a call to get the auth token
// or it returns the same promise as an in-progress call to get the auth token
// https://github.com/axios/axios/issues/450

const getAuthToken = () => {
  if (!authTokenRequest) {
    authTokenRequest = refresh()
    authTokenRequest.then(resetAuthTokenRequest, resetAuthTokenRequest);
  }

  return authTokenRequest;
}

const resetAuthTokenRequest = () =>  {
  authTokenRequest = null;
}

const refreshToken = token => {
    return {
        type: "REFRESH_TOKEN",
        data: token
    }
}

axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        return response
    },
    async error => {
        let originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const response = await getAuthToken()
                console.log(response)
                if (response.status === 201) {
                    const cookie = Cookies.get("accessToken")
                    store.dispatch(refreshToken({ accessToken: cookie }))

                    let originalData = JSON.parse(originalRequest.data)
                    originalData = { ...originalData, accessToken: cookie }
                    originalRequest = {
                        ...originalRequest,
                        data: JSON.stringify(originalData)
                    }

                    return axios(originalRequest)
                }
            } catch (e) {
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

const getPlaylists = async tokens => {
    const response = await axios.post(baseUrl + "playlists", tokens)
    return response.data
}

const getTracks = async obj => {
    const response = await axios.post(baseUrl + "tracks", obj)
    return response.data
}

const getRecentTracks = async obj => {
    const response = await axios.post(baseUrl + "tracks/recent", obj)
    return response.data
}

const getAlbum = async obj => {
    const response = await axios.post(baseUrl + "album", obj)
    return response.data
}

export default {
    getPlaylists,
    getTracks,
    getRecentTracks,
    getAlbum
}
