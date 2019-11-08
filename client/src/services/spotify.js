import axios from "axios"
import { refresh } from "./auth"
import Cookies from "js-cookie"
import store from "../store"
const baseUrl = "/api/spotify/"

// if status 401 hit refresh endpoint and try again

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
                const response = await refresh()
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
