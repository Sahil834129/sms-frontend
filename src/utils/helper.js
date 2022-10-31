import * as Yup from "yup"
import RestEndPoint from "../redux/constants/RestEndpoints";
import RESTClient from "./RestClient";

export const refreshAccessToken = async() => {
    if (getLocalData("token") == null)
        return;
    try {
        localStorage.removeItem("token");
        const response = await RESTClient.post(RestEndPoint.REFRESH_TOKEN, {"refreshToken": getLocalData("refreshToken")});
        setLocalData("token", response.data.token);
        setLocalData("refreshToken", response.data.refreshToken);
        return response.data.token;
    } catch (error) {
        console.log("Error :" + error);
    }
}

export const setLocalData = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch(e) {
        //console.log("error: " + e)
    }
}

export const logout = () => {
    resetUserLoginData();
}

export const resetUserLoginData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
}

export const setUserLoginData = (loginData) => {
    setLocalData("token", loginData.token);
    setLocalData("refreshToken", loginData.refreshToken);
    setLocalData("name", loginData?.firstName);
}

export const getLocalData = (key) => {
    return localStorage.getItem(key);
}

export const isLoggedIn = () => {
    try {
        return (localStorage.getItem("token") !== null);
    } catch (e) {
        console.log("Error on getting loggen in user : " + e);
    }
    return false;
}

export const isValidatePhone = (v) => {
    const phoneSchema = Yup.string().matches(/^[7-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    try {
        phoneSchema.validateSync(v);    
        return true;
    } catch (error) {
        return false;
    }
}
