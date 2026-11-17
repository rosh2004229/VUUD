import { RFValue } from "react-native-responsive-fontsize";
import { Platform, Dimensions, StatusBar } from "react-native";
import axios from "axios";
import * as firebaseAnalytics from "@react-native-firebase/analytics";

export const API_INTERNET_CONNECTION_CAPTION_EN =
  "Sorry, No Internet connectivity detected. Please reconnect and try again";

export const API_FAILURE_CAPTION_EN =
  "Something went wrong, Please try again later";

export const SEND_OTP_FORNT_URL =
  "https://2factor.in/API/V1/67396ee6-2246-11ea-9fa5-0200cd936042/SMS/";

// export const BASE_URL = 'http://192.168.1.200:8080/indiainfluencer/api/'; // local
// export const IMG_BASE_URL = 'http://192.168.1.200:8080/indiainfluencer/public/'; // Local img path

// export const BASE_URL = 'https://app.indiainfluencer.com/api/';
// export const IMG_BASE_URL = 'https://app.indiainfluencer.com/public/';
// export const BASE_URL = "https://app.influenstar.in/api/";
export const BASE_URL = "http://192.168.1.40:2200/api/";
export const IMG_BASE_URL = "https://app.influenstar.in/public/";

//CMS Link
export const PRIVACY_POLICY = "https://influenstar.in/privacy-policy/";
export const TERMS_CONDITION = "https://influenstar.in/terms-conditions/";
export const ABOUT_US = "https://influenstar.in/about-us/";

export const limitPage = "8";

export const activeOpacity = 0.9;
export const dateDisplayFormate = "DD MMM yyyy";

// convertCurrencyFormat
export function kFormatter(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(0) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(0) + "M"
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(0) + "K"
        : Math.abs(Number(labelValue));
}

export function kFormatterYoutube(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(0) + "K"
        : Math.abs(Number(labelValue));
}

export function formatWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+\b)/g, ",");
}

export const elevation = 1;

export const LOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
  forceRequestLocation: true,
  // forceLocationManager: true
}

const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const validateFormCheck = text => {
  if (regEmail.test(text) === false) {
    return false;
  } else {
    return true;
  }
};

export const COLORS = {
  // primary: '#652f8f',
  // primary: '#ef4b53',
  primary: "#eb297b",
  // primary: '#F76600',
  // primary: '#F07C00',
  light_pink: "#FF90BC",
  color_ffd04e: "#ffd04e",
  color_469520: "#469520",
  color_F4591B: "#F4591B",
  bg_color: "#f5f5f5",
  black_txt: "#0A0303",
  gry_text: "#626769",
  gry_light: "#9EA4B6",
  white_txt: "#fafafa",
  white_original: "#ffffff",
  back_blure: "#EDF2F6",
  otp_Bg_color: "#ffd04e",
  placehld_txtcolor: "#9F9F9F",
  refecode_backcolor: "#F5F5F5",
  transparent: "transparent",
  img_backcolor: "#EBEBEB",
  border_color: "#868686",
  backgroundcolor: "#E5E5E5",
  color_2F315E: "#2F315E",
  card_bg: "#fafafa",
  shadow_color: "#EBEDF5",

  color_1B1A1A: "#1B1A1A",
  color_868686: "#868686",

  color_494D99: "#494D99",
  color_333562: "#1a75ff",
  color_red: "#F20101",
  color_333333: "#333333",
  comment_bg_color: "#2F315E",
  colorGreen: "#4DA101",
  // colorGreen: '#eb297b',

  bottom_tab_color: "#BB1F2A",
  color_red_light: "#B70011",
  yellow_light: "#F9AC3C",
  blue_light: "#B1B2B3",
  very_light_grey: "#ebebeb",
  // start_color: "#f08d48",
  // center_color: "#ed9b61",
  // end_color: "#e8ac82"
  color_toolbar_btn_BG: "#F78B3B",
  // start_color: '#2F315E',
  // center_color: '#2F315E',
  // end_color: '#5057af',

  start_color: "#fafafa",
  center_color: "#ede8e8",
  end_color: "#d9d4d4",
  color_light_Green: "#73a14a",
  // color_light_Green: '#ef4b53',
  twitter_color: "#1D9BF0",
  fb_color: "#0E8CF1",
  color_transparent_black: "#0A0A0A77",
  very_light_orange: "#F8F1F4",
  very_light_pink: "#f7b4d1",
};

export function statusColor(labelValue) {
  switch (labelValue) {
    case "1":
      return COLORS.colorGreen;
      break;

    case "2":
      return COLORS.color_red;
      break;

    case "3":
      return COLORS.gry_text;
      break;
    case "4":
      return COLORS.color_red;
      break;
    default:
      break;
  }
}

export function statusName(labelValue) {
  switch (labelValue) {
    case "1":
      return "Accepted";
      break;

    case "2":
      return "Rejected";
      break;

    case "3":
      return "Pending";
      break;
    case "4":
      return "Cancel";
      break;
    default:
      break;
  }
}

export const FONTS = {
  FontLight: Platform.OS === "ios" ? "Poppins-Light" : "Poppins-Light",
  FontMedium: Platform.OS === "ios" ? "Poppins-Medium" : "Poppins-Medium",
  FontRegular: Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-Regular",
  FontSemiBold: Platform.OS === "ios" ? "Poppins-SemiBold" : "Poppins-SemiBold",
};

export const FONTS_SIZE = {
  txt_4: 4,
  txt_8: 8,
  txt_9: 9,
  txt_10: 10,
  txt_11: 11,
  txt_12: 12,
  txt_13: 13,
  txt_14: 14,
  txt_15: 15,
  txt_16: 16,
  txt_17: 17,
  txt_18: 18,
  txt_20: 20,
  txt_21: 21,
  txt_22: 22,
  txt_24: 24,
  txt_25: 25,
  txt_26: 26,
  txt_27: 27,
  txt_28: 28,
  txt_30: 30,
  txt_35: 35,
  txt_40: 40,
  txt_50: 50,
  txt_60: 60,
  txt_80: 80,
  txt_90: 90,
};

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get("window");

export const isIPhoneX = () =>
  Platform.OS === "ios" && !Platform.isPad
    ? (width === X_WIDTH && height === X_HEIGHT) ||
    (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 70 : 30,
  android: StatusBar.currentHeight,
  default: 0,
});

export const getInstagramFollowers = (userName) => {
  axios
    .create({
      headers: {
        "user-agent":
          "Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)",
      },
    })
    .get(
      "https://i.instagram.com/api/v1/users/web_profile_info/?username=" +
      userName
    )
    .then((res) => {
      console.log("res ====> ", res.data.data.user.edge_followed_by.count);
      try {
        return (followers = kFormatter(
          res.data.data.user.edge_followed_by.count
        ));
      } catch (error) {
        console.log("error ====> ", error);
        return "0";
      }
    })
    .catch((err) => {
      console.log("error:\n" + err);
    })
    .finally(() => {
      // console.log('end');
    });
};

export function generateUUID(digits) {
  let str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ";
  let uuid = [];
  for (let i = 0; i < digits; i++) {
    uuid.push(str[Math.floor(Math.random() * 2)]);
  }
  return new Date().getTime().toString();
}

export const analyticsLog = async (value) => {
  try {
    if (
      typeof firebaseAnalytics?.getAnalytics === "function" &&
      typeof firebaseAnalytics?.logEvent === "function"
    ) {
      const analyticsInstance = firebaseAnalytics.getAnalytics();
      await firebaseAnalytics.logEvent(analyticsInstance, value, {
        screen_name: value,
      });
    } else if (typeof firebaseAnalytics?.default === "function") {
      await firebaseAnalytics.default().logEvent(value, {
        screen_name: value,
      });
    }
  } catch (error) {
    console.warn("Analytics log error:", error?.message || error);
  }
};

const appTheme = {
  COLORS,
  FONTS,
  FONTS_SIZE,
  API_INTERNET_CONNECTION_CAPTION_EN,
  API_FAILURE_CAPTION_EN,
  BASE_URL,
  limitPage,
  StatusBarHeight,
  activeOpacity,
  dateDisplayFormate,
  kFormatter,
  elevation,
  getInstagramFollowers,
  statusColor,
  statusName,
  IMG_BASE_URL,
  generateUUID,
  PRIVACY_POLICY,
  TERMS_CONDITION,
  ABOUT_US,
  analyticsLog,
  validateFormCheck
};

export default appTheme;
