import axios from "axios";
import { BASE_URL, SEND_OTP_FORNT_URL } from "./utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

// List of endpoints that are strictly public (pre-login) and must NOT send Authorization Bearer
const PRE_LOGIN_PUBLIC_ENDPOINTS = [
  "login",
  "login1",
  "otplogin",
  "register1",
  "register1verified",
  "register2",
  "verifyOTP",
  "forgotpassword",
];
const AUTH_ENDPOINTS = PRE_LOGIN_PUBLIC_ENDPOINTS;

// Helper to format FormData into readable JSON object for logging
const formatPayloadForLog = (params) => {
  if (!params) return null;
  if (params._parts && Array.isArray(params._parts)) {
    const formatted = {};
    params._parts.forEach(([key, value]) => {
      if (value && typeof value === "object" && value.uri) {
        formatted[key] = {
          name: value.name,
          type: value.type,
          uri: value.uri,
        };
      } else {
        formatted[key] = value;
      }
    });
    return formatted;
  }
  return params;
};

const _REQUEST2SERVER = async (url, params = null) => {
  const isGet = params == null;
  const token = await AsyncStorage.getItem("user_token");
  const isPreLoginApi = PRE_LOGIN_PUBLIC_ENDPOINTS.some((ep) => url.startsWith(ep));
  const isAuthApi = AUTH_ENDPOINTS.some((ep) => url.startsWith(ep));
  const isFormData = params instanceof FormData;

  const headers = {
    Accept: "application/json",
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token != undefined && token != null && !isPreLoginApi) {
    headers["Authorization"] = "Bearer " + token;
  }

  var config = {
    method: "post",
    url: BASE_URL + url,
    headers: headers,
    data: isFormData ? params : (params !== null && params !== undefined ? params : {}),
  };

  const shouldLog = isAuthApi || url === "getCaterory" || url === "addName" || url === "addMultiplecategory";

  if (shouldLog) {
    console.log(`\n==================== [API REQUEST: ${url}] ====================`);
    console.log(`Endpoint: ${url}`);
    console.log(`Full URL: ${BASE_URL + url}`);
    console.log(`Method: ${config.method.toUpperCase()}`);
    console.log(`Payload:`, formatPayloadForLog(params));
    console.log(`============================================================\n`);
  }

  return await new Promise(function (resolve, reject) {
    console.log("config--->", config);
    axios(config)
      .then((data) => {
        if (shouldLog) {
          console.log(`\n==================== [API RESPONSE SUCCESS: ${url}] ====================`);
          console.log(`Endpoint: ${url}`);
          console.log(`Full URL: ${BASE_URL + url}`);
          console.log(`Status Code: ${data.status}`);
          console.log(`Response Data:`, data.data);
          console.log(`=========================================================================\n`);
        }
        if (data.status === 200) resolve(data.data);
        else reject(data.data);
      })
      .catch((error) => {
        if (shouldLog) {
          console.log(`\n==================== [API RESPONSE ERROR: ${url}] ====================`);
          console.log(`Endpoint: ${url}`);
          console.log(`Full URL: ${BASE_URL + url}`);
          console.log(`Error Response:`, error?.response?.data || error?.message || error);
          console.log(`======================================================================\n`);
        }
        const errorData =
          error?.response?.data ||
          error?.message ||
          error ||
          "Something went wrong, Please try again later";
        reject(errorData);
      });
  });
};

const _REQUEST2SERVER_SINGUP = async (url, params = null) => {
  const isGet = params == null;
  const token = await AsyncStorage.getItem("user_token");
  const isAuthApi = AUTH_ENDPOINTS.some((ep) => url.startsWith(ep));
  const isFormData = params instanceof FormData;

  const headers = {
    Accept: "application/json",
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token != undefined && token != null && !isAuthApi) {
    headers["Authorization"] = "Bearer " + token;
  }

  var config = {
    method: "post",
    url: BASE_URL + url,
    headers: headers,
    data: isFormData ? params : (params !== null && params !== undefined ? params : {}),
  };

  if (isAuthApi) {
    console.log(`\n==================== [AUTH API REQUEST] ====================`);
    console.log(`Endpoint: ${url}`);
    console.log(`Full URL: ${BASE_URL + url}`);
    console.log(`Method: ${config.method.toUpperCase()}`);
    console.log(`Payload:`, isFormData ? formatPayloadForLog(params) : params);
    console.log(`============================================================\n`);
  }

  return await new Promise(function (resolve, reject) {
    console.log("config--->", config);
    axios(config)
      .then((data) => {
        if (isAuthApi) {
          console.log(`\n==================== [AUTH API RESPONSE SUCCESS] ====================`);
          console.log(`Endpoint: ${url}`);
          console.log(`Full URL: ${BASE_URL + url}`);
          console.log(`Status Code: ${data.status}`);
          console.log(`Response Data:`, data?.data || data);
          console.log(`=====================================================================\n`);
        }
        if (data.status === 200) resolve(data);
        else reject(data);
      })
      .catch((error) => {
        if (isAuthApi) {
          console.log(`\n==================== [AUTH API RESPONSE ERROR] ====================`);
          console.log(`Endpoint: ${url}`);
          console.log(`Full URL: ${BASE_URL + url}`);
          console.log(`Error Response:`, error?.response?.data || error?.message || error);
          console.log(`===================================================================\n`);
        }
        reject(error);
      });
  });
};

const _REQUEST2SERVER_GET = async (url, params = null) => {
  const token = await AsyncStorage.getItem("user_token");
  const isAuthApi = AUTH_ENDPOINTS.some((ep) => url.startsWith(ep));

  var config = {
    method: "get",
    url: BASE_URL + url,
    headers: {
      Accept: "application/json",
      ...(token != undefined && token != null && !isAuthApi
        ? { Authorization: "Bearer " + token }
        : {}),
    },
    params: params,
  };

  if (isAuthApi) {
    console.log(`\n==================== [AUTH API REQUEST (GET)] ====================`);
    console.log(`Endpoint: ${url}`);
    console.log(`Full URL: ${BASE_URL + url}`);
    console.log(`Method: GET`);
    console.log(`==================================================================\n`);
  }

  return await new Promise(function (resolve, reject) {
    console.log("config--->", config);
    axios(config)
      .then((data) => {
        if (isAuthApi) {
          console.log(`\n==================== [AUTH API RESPONSE SUCCESS] ====================`);
          console.log(`Endpoint: ${url}`);
          console.log(`Full URL: ${BASE_URL + url}`);
          console.log(`Status Code: ${data.status}`);
          console.log(`Response Data:`, data.data);
          console.log(`=====================================================================\n`);
        }
        if (data.status === 200) resolve(data.data);
        else reject(data.data);
      })
      .catch((error) => {
        if (isAuthApi) {
          console.log(`\n==================== [AUTH API RESPONSE ERROR] ====================`);
          console.log(`Endpoint: ${url}`);
          console.log(`Full URL: ${BASE_URL + url}`);
          console.log(`Error Response:`, error?.response?.data || error?.message || error);
          console.log(`===================================================================\n`);
        }
        const errorData =
          error?.response?.data ||
          error?.message ||
          error ||
          "Something went wrong, Please try again later";
        reject(errorData);
      });
  });
};

// Auth API call
// export const onLoginAPICall = (params) => {
//   return _REQUEST2SERVER(`login`, params);
// };
export const onLoginAPICall = (params) => {
  return _REQUEST2SERVER(`login1`, params);
};

export const onStandardLoginAPICall = (params) => {
  return _REQUEST2SERVER(`login`, params);
};

export const onRegisterVerifiedAPICall = async (token) => {
  let cleanToken = token;
  if (typeof cleanToken === "string" && cleanToken.startsWith("token=")) {
    cleanToken = cleanToken.replace("token=", "");
  }
  const encodedToken = encodeURIComponent(cleanToken);
  try {
    console.log("[APIWebCall] Calling register2?token= with verification_token...");
    const res = await _REQUEST2SERVER_GET(`register2?token=${encodedToken}`);
    console.log("[APIWebCall] register2 response:", res);
    if (res?.status === true || res?.status === 200 || res?.status === "true") {
      return res;
    }
    console.log("[APIWebCall] register2 not successful, trying register1verified?token= fallback...");
    return await _REQUEST2SERVER_GET(`register1verified?token=${encodedToken}`);
  } catch (err) {
    console.log("[APIWebCall] register2 error, trying register1verified fallback:", err);
    return await _REQUEST2SERVER_GET(`register1verified?token=${encodedToken}`);
  }
};

export const onRegister2APICall = (token) => {
  let cleanToken = token;
  if (typeof cleanToken === "string" && cleanToken.startsWith("token=")) {
    cleanToken = cleanToken.replace("token=", "");
  }
  return _REQUEST2SERVER_GET(`register2?token=${encodeURIComponent(cleanToken)}`);
};

export const onLoginAPICall_OTP = (params) => {
  return _REQUEST2SERVER(`otplogin`, params);
};

export const onRegisterAPICall = (params) => {
  return _REQUEST2SERVER_SINGUP(`register1`, params);
};

export const onForgot_Password_APICall = (params) => {
  return _REQUEST2SERVER_SINGUP(`forgotpassword`, params);
};
//

export const onGetUserAPICall = (params) => {
  return _REQUEST2SERVER(`getProfile`, params);
};

export const onEditUserAPICall = (params) => {
  return _REQUEST2SERVER(`editProfile`, params);
};

export const onProfileImagesUploadAPICall = (params) => {
  return _REQUEST2SERVER(`addProfileImages`, params);
};

export const onProfileImagesDeleteAPICall = (params) => {
  return _REQUEST2SERVER(`deleteProfileImage`, params);
};
export const onInfluencerListAPICall = (params) => {
  return _REQUEST2SERVER(`InfluencerList`, params);
};
// // SearchInfluencer
// export const onSearchInfluencerListAPICall = (params) => {
//   return _REQUEST2SERVER(`SearchInfluencer`, params);
// };
// SearchInfluencer
export const onSearchInfluencerListAPICall = (params) => {
  return _REQUEST2SERVER(`SearchInfluencerGlobalywithHashtag`, params);
};
// blockAccount
export const onBlockUserAPICall = (params) => {
  return _REQUEST2SERVER(`blockAccount`, params);
};
// onReportsUserAPICall
export const onReportsUserAPICall = (params) => {
  return _REQUEST2SERVER(`reportAccount`, params);
};

// deleteAccount
export const onDeleteAccountAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`deleteAccount`, params);
};
// Notification List
export const onNotificationListAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`NotificationList`, params);
};

// read Notification List
export const UnreadNotificationCountAPI = (params, navigation) => {
  return _REQUEST2SERVER(`notificationReadUpdate`, params);
};

export const onHireInfluencerAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`hireinfluencer`, params);
};

export const onAcceptOrRejectAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`notificationstatus`, params);
};

// ReceivedHireRequestList
export const onReceivedHireRequestListAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`ReceivedHireRequestList`, params);
};

// ReceivedHireRequestList
export const onMyRequestListAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`MySendedRequsetList`, params);
};

// CancelRequest
export const onCancelRequestAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`CancelRequest`, params);
};
// CancelRequest
export const onUploadProfilePicAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`UploadProfilePic`, params);
};

// CancelRequest
export const onUpdateInstaCountAPICall = (params, navigation) => {
  return _REQUEST2SERVER(`UpdateInstaCount`, params);
};

// get Category List
export const onInfluencerCategoryListAPICall = (params) => {
  return _REQUEST2SERVER(`getCaterory`, params);
};
export const onInfluencerListByTypeAPICall = (params) => {
  return _REQUEST2SERVER(`TypeInfluencerList`, params);
};

export const onInfluencerListByCategoryAPICall = (params) => {
  return _REQUEST2SERVER(`CategoryInfluencerList`, params);
};

// getCity
export const onGetCityListAPICall = (params) => {
  return _REQUEST2SERVER(`getCity`, params);
};
// getCountry
export const onGetCountryListAPICall = (params) => {
  return _REQUEST2SERVER(`getCountry`, params);
};

// getHashtag
export const onGeHashListAPICall = (params) => {
  return _REQUEST2SERVER(`getHashtag`, params);
};
// addFCMToken
export const onFCMTokenAPICall = (params) => {
  return _REQUEST2SERVER(`addFCMToken`, params);
};

// onoffNotification
export const onNotificationSwitchChangeAPICall = (params) => {
  return _REQUEST2SERVER(`onoffNotification`, params);
};

// chatList
export const onChatListAPICall = (params) => {
  return _REQUEST2SERVER(`chatList`, params);
};

// lastMessageUpdated
export const onLastMessageUpdatedAPICall = (params) => {
  return _REQUEST2SERVER(`lastMessageUpdated`, params);
};

// NotificationCount
export const onNotificationCount = (params) => {
  return _REQUEST2SERVER(`UnreadNotificationCount`, params);
};
// version api
export const onVersionCheckAPICall = (params) => {
  return _REQUEST2SERVER("versionCheck", params);
};

//verifyOTP
export const onVerifyApiCall = (params) => {
  return _REQUEST2SERVER("verifyOTP", params);
};

// User Name Add API
export const onNameAddApiCall = async (params) => {
  console.log("[APIWebCall] onNameAddApiCall initiated with params:", params);
  try {
    const res = await _REQUEST2SERVER(`addName`, params);
    if (res?.status === false) {
      console.log("[APIWebCall] addName returned status false, attempting fallback format...");
      throw res;
    }
    return res;
  } catch (err) {
    console.log("[APIWebCall] onNameAddApiCall initial attempt failed:", err);
    if (!(params instanceof FormData)) {
      console.log("[APIWebCall] Retrying addName with FormData fallback...");
      const fd = new FormData();
      Object.keys(params).forEach((k) => {
        if (params[k] !== undefined && params[k] !== null) {
          fd.append(k, String(params[k]));
        }
      });
      try {
        return await _REQUEST2SERVER(`addName`, fd);
      } catch (fdErr) {
        console.log("[APIWebCall] FormData fallback also failed:", fdErr);
        throw fdErr || err;
      }
    } else {
      console.log("[APIWebCall] Retrying addName with JSON fallback...");
      const jsonObj = {};
      if (params._parts && Array.isArray(params._parts)) {
        params._parts.forEach(([key, val]) => {
          jsonObj[key] = key === "user_id" || key === "step" ? (isNaN(val) ? val : Number(val)) : val;
        });
      }
      try {
        return await _REQUEST2SERVER(`addName`, jsonObj);
      } catch (jsonErr) {
        console.log("[APIWebCall] JSON fallback also failed:", jsonErr);
        throw jsonErr || err;
      }
    }
  }
};

//Add City
export const onCityAddApiCall = (params) => {
  return _REQUEST2SERVER(`addCity`, params);
};

// User photo
export const onUserPhotoApiCall = (params) => {
  return _REQUEST2SERVER(`addProfilePic`, params);
};
// User Type Add API
export const onUserTypeAddApiCall = (params) => {
  return _REQUEST2SERVER(`addUsertype`, params);
};

// Insta Id and Youtube channel Add API
export const onInstagramDetailsAddApiCall = (params) => {
  return _REQUEST2SERVER(`addSocial`, params);
};

// Category Add API
export const onCategoryAddApiCall = (params) => {
  return _REQUEST2SERVER(`addMultiplecategory`, params);
};

// HashKeyword Add API
export const onHashKeywordAddApiCall = (params) => {
  return _REQUEST2SERVER(`addMultiplehastags`, params);
};

// multiple reg img
export const addMultiplemediapicAPICall = (params) => {
  return _REQUEST2SERVER(`addMultiplemediapic`, params);
};

// getRequestCount
export const getRequestCountAPI = (params) => {
  return _REQUEST2SERVER(`getRequestCount`, params);
};

// getRequestUpdate
export const getRequestUpdateAPI = (params) => {
  return _REQUEST2SERVER(`getRequestUpdate`, params);
};

// conert to influencer
export const getConvertToInfluencerAPI = (params) => {
  return _REQUEST2SERVER(`ChangeType`, params);
};

const APIWebCall = {
  onLoginAPICall,
  onStandardLoginAPICall,
  onRegisterVerifiedAPICall,
  onRegister2APICall,
  //onSignUpAPICall,
  onRegisterAPICall,
  onForgot_Password_APICall,
  onGetUserAPICall,
  onEditUserAPICall,
  onLoginAPICall_OTP,
  onProfileImagesUploadAPICall,
  onProfileImagesDeleteAPICall,
  onInfluencerListAPICall,
  onSearchInfluencerListAPICall,
  onBlockUserAPICall,
  onReportsUserAPICall,
  onDeleteAccountAPICall,
  onNotificationListAPICall,
  onHireInfluencerAPICall,
  onAcceptOrRejectAPICall,
  onReceivedHireRequestListAPICall,
  onMyRequestListAPICall,
  onCancelRequestAPICall,
  onUploadProfilePicAPICall,
  onUpdateInstaCountAPICall,
  onInfluencerCategoryListAPICall,
  onGetCityListAPICall,
  onInfluencerListByTypeAPICall,
  onInfluencerListByCategoryAPICall,
  onGeHashListAPICall,
  onFCMTokenAPICall,
  onNotificationSwitchChangeAPICall,
  onChatListAPICall,
  onLastMessageUpdatedAPICall,
  onNotificationCount,
  onVersionCheckAPICall,
  onVerifyApiCall,
  onNameAddApiCall,
  onUserTypeAddApiCall,
  onInstagramDetailsAddApiCall,
  onCategoryAddApiCall,
  onHashKeywordAddApiCall,
  onUserPhotoApiCall,
  addMultiplemediapicAPICall,
  onGetCountryListAPICall,
  onCityAddApiCall,
  UnreadNotificationCountAPI,
  getRequestCountAPI,
  getRequestUpdateAPI,
  getConvertToInfluencerAPI,
};

export default APIWebCall;
