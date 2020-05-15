import axios from "axios"
const baseUrl = "/api/songsterr/"

const getTabs = async (tracks) => {
    const response = await axios.post(baseUrl + "tracks/multiple", tracks)
    return response.data
}

export default {
    getTabs,
}
