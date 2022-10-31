import axios from "axios";
import PageContent from "../resources/pageContent";
import {getLocalData, refreshAccessToken} from "../utils/helper";

axios.defaults.baseURL = "https://api.escuelajs.co/api/"; //process.env.BASE_URL;

export default class RESTClient {

    static async get(action, params) {
        return await axios.get(action, params);
    }

    static async post(action, params) {
        return await axios.post(action, params);
    }

    static async put(action, params) {
        return await axios.put(action, params);
    }

    static async patch(action, params) {
        return await axios.patch(action, params);
    }

    static async delete(action, params) {
        return await axios.delete(action, params);
    }

    static getAPIErrorMessage(error) {
        if (error.response && error.response.data)
            return error.response.data.apierror?.message
        return PageContent.UNEXPECTED_ERROR_MSG
    }
};

axios.interceptors.request.use(
    async (config) => {
        // Do something before request is sent
        config.baseURL = "http://ec2-65-0-204-110.ap-south-1.compute.amazonaws.com:8080/api/";
        //config.baseURL = "http://59.144.164.132:8080/api/"; //process.env.BASE_URL;
        const token = await getLocalData("token");
        config.headers.common["Authorization"] = token ? "Bearer " + token : "";
        return config;
    }
);

axios.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    async(error) => {
        const originalRequest = error.config;
        const { response } = error;
        if (response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const token = await refreshAccessToken();
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
        }
        
        if (response.status === 401 || response.status === 404) {
            return Promise.reject(error);
        } else {
            return Promise.reject(error);
        }
    },
);