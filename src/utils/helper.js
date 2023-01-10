import moment from "moment";
import * as Yup from "yup";
import { ADMIN_DASHBOARD_LINK, MANAGE_USER_PERMISSION, SCHOOL_APPLICATION_STATUS } from "../constants/app";
import RestEndPoint from "../redux/constants/RestEndpoints";
import { getDefaultDateFormat } from "./DateUtil";
import RESTClient from "./RestClient";

export const refreshAccessToken = async () => {
  if (getLocalData("token") == null) return;
  try {
    localStorage.removeItem("token");
    const response = await RESTClient.post(RestEndPoint.REFRESH_TOKEN, {
      refreshToken: getLocalData("refreshToken"),
    });
    setLocalData("token", response.data.token);
    setLocalData("refreshToken", response.data.refreshToken);
    return response.data.token;
  } catch (error) {
    logout();
    console.log("Error :" + error);
  }
};

export const setLocalData = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    //console.log("error: " + e)
  }
};

export const logout = () => {
  resetUserLoginData();
  window.location.reload();
};

export const resetUserLoginData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("modulePermissions");
  localStorage.removeItem("name");
  localStorage.removeItem("roles");
  localStorage.removeItem("schoolId");
};

export const setUserLoginData = (loginData) => {
  setLocalData("token", loginData.token);
  setLocalData("refreshToken", loginData.refreshToken);
  setLocalData("modulePermissions", JSON.stringify(loginData.modulePermissions || []));
  setLocalData("name", loginData?.firstName);
  setLocalData("roles", loginData?.roles);
  setLocalData("schoolId", loginData?.schoolId);
  setLocalData("schoolName", loginData?.schoolName);
};

export const getLocalData = (key) => {
  return localStorage.getItem(key);
};

export const isLoggedIn = () => {
  try {
    return localStorage.getItem("token") !== null;
  } catch (e) {
    console.log("Error on getting loggen in user : " + e);
  }
  return false;
};

export const isValidatePhone = (v) => {
  const phoneSchema = Yup.string().matches(/^[7-9]\d{9}$/, {
    message: "Please enter valid number.",
    excludeEmptyString: false,
  });
  try {
    phoneSchema.validateSync(v);
    return true;
  } catch (error) {
    return false;
  }
};

export const str2bool = (value) => {
  if (value && typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return value;
};

export function humanize(str, changeStatusVal) {
  let i;
  try {
    if (changeStatusVal) {
      if (str === SCHOOL_APPLICATION_STATUS.AT_PI) {
        return "Shortlist for AT/PI";
      }
      if (str === SCHOOL_APPLICATION_STATUS.UNDER_FINAL_REVIEW) {
        return "Send For Final Approval";
      }
      if (str === SCHOOL_APPLICATION_STATUS.APPROVED) {
        return "Approved";
      }
      if (str === SCHOOL_APPLICATION_STATUS.DECLINED) {
        return "Declined";
      }
    }
    let frags = str ? str.split("_") : [];
    for (i = 0; i < frags.length; i++) {
      frags[i] =
        frags[i].charAt(0).toUpperCase() + frags[i].slice(1).toLowerCase();
    }
    return frags.join(" ");
  } catch (e) {
    console.log(e, str);
    return str;
  }
}

export function convertCamelCaseToPresentableText(str) {

  if (str.includes('-')) {
    let string = str.replace("-", " ");
    return string
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

export function gotoHome(e, navigate) {
  e.preventDefault();
  navigate(isLoggedIn() ? "/userProfile" : "/");
}

export function getStudentAge(dateOfBirth) {
  const baseDate = moment().set("date", 31).set("month", 2);
  return baseDate.diff(moment(dateOfBirth, getDefaultDateFormat()), "years");
}

export function getAge(dateOfBirth) {
  return moment().diff(moment(dateOfBirth, getDefaultDateFormat()), "years");
}

export function getChildAge(dateOfBirth) {
  let dateAsOnSTR = "31/03/" + moment().year();
  let age = 0;
  try {
    age = moment(dateAsOnSTR, "DD/MM/YYYY").diff(
      moment(dateOfBirth, "DD/MM/YYYY"),
      "years"
    );
  } catch (error) {
    console.log("Error while parsing the date : " + dateOfBirth);
  }
  return age;
}

export function getStudentMaxDateOfBirth() {
  return moment().subtract(2, "years").set("date", 31).set("month", 2).toDate();
}

export function getGuadianMaxDateOfBirth() {
  return moment().subtract(10, "years").toDate();
}

// It needs an array of class names and returns the suitable class based on student age
export function getClassBasedOnAge(classMapWithAge, classOptions, childAge) {
  let age = 0;
  let availableClassOptionsAgeMap = {};
  let classOptionTexts = classOptions.length
    ? classOptions.map((it) => it.text.toLowerCase())
    : [];
  Object.entries(classMapWithAge).forEach(([k, v]) => {
    if (classOptionTexts.indexOf(v.replace("_", " ").toLowerCase()) >= 0)
      availableClassOptionsAgeMap[k] = v.replace("_", " ");
  });
  Object.keys(availableClassOptionsAgeMap).forEach((value, idx) => {
    if (parseInt(value) <= childAge && parseInt(value) > age) age = value;
  });
  return availableClassOptionsAgeMap[parseInt(age)];
}

export function isEmpty(obj) {
  return (
    obj === null ||
    obj === "null" ||
    obj === undefined ||
    obj === "undefined" ||
    obj.length === 0
  );
}

export const getHeaderLink = () => {
  let modulePermissions = getLocalData('modulePermissions');
  if (modulePermissions !== null) {
    modulePermissions = JSON.parse(modulePermissions);
    return ADMIN_DASHBOARD_LINK.map(adminVal => {
      const filterData = modulePermissions.find(val => val.moduleName === adminVal.title);
      if (adminVal.title !== "Dashboard") {
        adminVal.isPermit = filterData?.permissionType || MANAGE_USER_PERMISSION[1];
        adminVal.canApprove = filterData?.canApprove || false;
      } else {
        adminVal.isPermit = MANAGE_USER_PERMISSION[0];
        adminVal.canApprove = false;
      }
      return adminVal;
    });
  }
  return [];
};


export const getCurrentModulePermission = (moduleName) => {
  let modulePermissions = getLocalData('modulePermissions');
  let flag = false;
  if (modulePermissions !== null) {
    modulePermissions = JSON.parse(modulePermissions);
    flag = !!modulePermissions.find(val => val.moduleName === moduleName && val.permissionType === MANAGE_USER_PERMISSION[2]);
  }
  console.log(flag);
  return flag;
};