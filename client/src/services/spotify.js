import axios from "axios"
import { refresh } from "./auth"
import Cookies from "js-cookie"
const baseUrl = "/api/spotify/"
let isRefreshing = false
let failedQueue = []
let cookie = null

const processQueue = (error, token = null) => { // https://gist.github.com/Godofbrowser/bf118322301af3fc334437c683887c5f
    failedQueue.forEach(prom => {
        /* istanbul ignore next */
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

axios.interceptors.request.use(
    config => {
        return config
    },
    /* istanbul ignore next */
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
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        let originalData = JSON.parse(originalRequest.data)
                        originalData = { ...originalData, accessToken: token }
                        originalRequest = {
                            ...originalRequest,
                            data: JSON.stringify(originalData)
                        }
                        return axios(originalRequest)
                    })
                    /* istanbul ignore next */
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            isRefreshing = true
            originalRequest._retry = true

            try {
                const response = await refresh()

                if (response.status === 201) {
                    cookie = Cookies.get("accessToken")

                    let originalData = JSON.parse(originalRequest.data)
                    originalData = { ...originalData, accessToken: cookie }
                    originalRequest = {
                        ...originalRequest,
                        data: JSON.stringify(originalData)
                    }
                    processQueue(null, cookie)

                    isRefreshing = false
                    return axios(originalRequest)
                }
                /* istanbul ignore next */
            } catch (e) {
                processQueue(e, null)

                isRefreshing = false
                return Promise.reject(e)
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

const searchSpotify = async obj => {
    const response = await axios.post(baseUrl + "search", obj)
    return response.data
}

const getUser = async obj => {
    const response = await axios.post(baseUrl + "user", obj)
    return response.data
}

export default {
    getPlaylists,
    getTracks,
    getRecentTracks,
    getAlbum,
    searchSpotify,
    getUser
}
