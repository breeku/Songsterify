import axios from 'axios'
const baseUrl = '/api/auth/'
let authTokenRequest

const login = async code => {
    const response = await axios.post(baseUrl + "login", {code})
    return response.data
}

export const refresh = async () => { // https://github.com/axios/axios/issues/450
    if (!authTokenRequest) {
        authTokenRequest = await axios.post(baseUrl + "refresh")
        authTokenRequest.then(resetAuthTokenRequest, resetAuthTokenRequest)
    }
    return authTokenRequest
}

function resetAuthTokenRequest() {
    authTokenRequest = null;
  }

export default {
    login
} 