import axios from 'axios'
const baseUrl = '/api/spotify/'

const getPlaylists = async tokens => {
    const response = await axios.post(baseUrl + 'playlists', tokens)
    return response.data
}

const getTracks = async obj => {
    const response = await axios.post(baseUrl + 'tracks', obj)
    return response.data
} 

const getRecentTracks = async obj => {
    const response = await axios.post(baseUrl + 'tracks/recent', obj)
    return response.data
}

const getAlbum = async obj => {
    const response = await axios.post(baseUrl + 'album', obj)
    return response.data
}

export default {
    getPlaylists,
    getTracks,
    getRecentTracks,
    getAlbum
}