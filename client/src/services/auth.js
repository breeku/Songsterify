import axios from "axios";
const baseUrl = "/api/auth/";

/* istanbul ignore next */
const login = async (code) => {
    const response = await axios.post(baseUrl + "login", { code });
    return response.data;
};

export const refresh = async () => {
    const response = await axios.post(baseUrl + "refresh");
    return response;
};

export default {
    login,
};
