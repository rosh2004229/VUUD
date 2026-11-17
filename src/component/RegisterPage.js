import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Dimensions,
  Image,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  BackHandler,
} from "react-native";
import TextCommonMedium from "../common/TextCommonMedium";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import TextInputView from "../common/TextInputView";
import ButtonView from "../common/ButtonView";
import {
  BASE_URL,
  COLORS,
  FONTS,
  FONTS_SIZE,
  activeOpacity,
  analyticsLog,
  dateDisplayFormate,
  getInstagramFollowers,
  kFormatter,
} from "../common/utils";
import Snackbar from "react-native-snackbar";
import APIWebCall from "../common/APIWebCall";
import NetInfo from "@react-native-community/netinfo";
import Loader from "../common/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetPermission from "../common/InternetPermission";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CommonOTPAPiCall from "../common/CommonOTPAPiCall";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioButton from "../common/RadioButton";
import ImagePickerCommon from "../common/ImagePickerCommon";
import TextCommonregular from "../common/TextCommonregular";
import moment from "moment/moment";
import SnackBarCommon from "../common/SnackBarCommon";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
import PhoneInput from "react-native-phone-number-input";
import DialogForcefullyDetails from "../common/DialogForcefullyDetails";
let { width, height } = Dimensions.get("window");

let boxCount = 2;
let boxWidth = width / boxCount;

function RegisterPage({ navigation }) {
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [number, setNumber] = useState("8530253956");
  const [full_name, setFullName] = useState("Pathik");
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [about, setAbout] = useState("");
  const [website_url, setWebsiteUrl] = useState("");
  const [company_name, setCompanyName] = useState("");

  const [fileName_pro_profile, setfileName_pro_profile] = useState("");
  const [fileType_profile, setfileType_profile] = useState("");
  const [fileUri_profile, setfileUri_profile] = useState("");

  const [isLoading, setisLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isImageSelectClick, setIsImageSelectClick] = useState(false);

  const [statusProgressCount, setStatusProgressCount] = useState(1);

  const [account, setAccount] = useState(true);
  const [userType, setUserType] = useState(false);
  const [socialFiled, setsocialFiled] = useState(false);
  const [btnName, setBtnName] = useState("Next");

  const [youtube_id, setYouTubeId] = useState("");
  const [instagram_id, setInstagramId] = useState("");
  const [twitterID, settwitterId] = useState("");

  const [instagram_followers, setInstagramFollowers] = useState("0");
  const [instagram_followers_pass_API, setInstagramFollowersPassAPI] =
    useState("0");
  const [instagram_followers_Error, setInstagramFollowersError] =
    useState(null);
  const [selectedValuesCat, setSelectedValuesCat] = useState("");
  const [selectedValuesArr, setSelectedValueArr] = useState([]);

  const phoneInput = useRef(null);
  const [countryCode, setCountryCode] = useState("91");
  const [countryCode_, setCountryCode_] = useState("IN");

  useFocusEffect(
    useCallback(() => {
      getCategoryData();
      analyticsLog("Register_screen");
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
      return () => {
        subscription.remove();
      };
    }, [])
  );

  const handleBackButtonClick = async () => {
    const selected_category_ayy = await AsyncStorage.getItem(
      "selected_category_ayy"
    );
    if (selected_category_ayy != undefined) {
      navigation.goBack(null);
    } else {
      AsyncStorage.removeItem("selected_category_ayy");
    }
    return true;
  };

  const getCategoryData = async () => {
    var save_category = await AsyncStorage.getItem("selected_category_ayy");
    if (save_category != undefined && save_category != null) {
      var selected_category = JSON.parse(save_category);
      setSelectedValueArr(selected_category);
      const selectedItems = selected_category
        .filter((item) => item.isSelected)
        .map((item) => item.name);
      setSelectedValuesCat(selectedItems.join(", "));
    } else {
      setSelectedValuesCat("");
      setSelectedValueArr([]);
    }
  };

  // useEffect(() => {
  //   getInstagramFollowers()
  // }, []);

  useEffect(() => {
    if (statusProgressCount === 1) {
      setAccount(true);
      setUserType(false);
      setsocialFiled(false);
    } else if (statusProgressCount === 2) {
      setAccount(false);
      setUserType(true);
      setsocialFiled(false);
      if (isInfluencer === false) {
        setBtnName("Register Now");
      } else {
        setBtnName("Next");
      }
    } else if (statusProgressCount === 3) {
      setAccount(false);
      setUserType(false);
      setsocialFiled(true);
      setBtnName("Register Now");
    }
    // if (statusProgressCount >= 4) {
    //   // navigation.navigate("LoginPage");
    // }
  }, [statusProgressCount]);

  const onImageSelectDone = (selectedImages) => {
    setIsImageSelectClick(false);
    if (
      selectedImages != undefined ||
      selectedImages != null ||
      selectedImages.length > 0
    ) {
      const obj = selectedImages[0];
      if (obj != undefined || obj != null) {
        setfileName_pro_profile(obj.fileName);
        setfileType_profile(obj.typeM);
        setfileUri_profile(obj.uri);
      }
    }
  };

  const onDateSelected = (event, value) => {
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false);
    }
    setBirthDate(value);
  };

  const onRegisterAPICall = async () => {
    if (statusProgressCount === 1) {
      if (full_name === "") {
        showMessage({
          message: "Enter Name",
          type: "danger",
        });
      } else if (number === "") {
        showMessage({
          message: "Enter Mobile Number",
          type: "danger",
        });
      } else {
        setStatusProgressCount(statusProgressCount + 1);
      }
    } else if (statusProgressCount === 2) {
      if (isInfluencer === false) {
        registerAPICallConfirm();
      } else {
        setStatusProgressCount(statusProgressCount + 1);
      }
    } else if (statusProgressCount === 3) {
      if (instagram_id === "") {
        showMessage({
          message: "Enter Instagram Id",
          type: "danger",
        });
      } else {
        setStatusProgressCount(statusProgressCount + 1);
      }
    } else if (isInfluencer === true && selectedValuesArr.length === 0) {
      showMessage({
        message: "Select category",
        type: "danger",
      });
    } else {
      registerAPICallConfirm();
    }
  };

  const registerAPICallConfirm = async () => {
    console.log("[RegisterPage] registerAPICallConfirm triggered");
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var data = new FormData();
      data.append("fullname", full_name);
      data.append("mobile", number);
      const fmtCountryCode = countryCode.startsWith("+") ? countryCode : `+${countryCode}`;
      data.append("country_code", fmtCountryCode);

      data.append("user_type", isInfluencer === true ? "2" : "1");
      data.append(
        "instagram_username",
        instagram_id != null || instagram_id != "" ? instagram_id : ""
      );
      data.append(
        "youtube_username",
        youtube_id != null || youtube_id != "" ? youtube_id : ""
      );
      data.append(
        "twitter_username",
        twitterID != null || twitterID != "" ? twitterID : ""
      );
      data.append(
        "instagram_count",
        instagram_followers_pass_API != undefined &&
          instagram_followers_pass_API != null &&
          instagram_followers_pass_API != ""
          ? instagram_followers_pass_API
          : 0
      );

      if (isInfluencer === true) {
        if (selectedValuesArr.length > 1) {
          for (let index1 = 0; index1 < selectedValuesArr.length; index1++) {
            const element_value = selectedValuesArr[index1];
            // const category_obj = {
            //   category_id: element_value.id,
            // };
            data.append("category_id[]", element_value.id.toString());
          }
        } else {
          const element = selectedValuesArr[0];
          // const category_obj = {
          //   category_id: element.id,
          // };
          data.append("category_id[]", element.id.toString());
        }
      } else {
      }

      console.log(JSON.stringify(data));
      registerAPICall(data);
    }
  };

  const registerAPICall = (data) => {
    setisLoading(true);
    console.log("[RegisterPage] Register API Triggered");
    console.log("[RegisterPage] Endpoint: register1");
    console.log("[RegisterPage] Full URL:", BASE_URL + "register1");
    console.log("[RegisterPage] Payload:", {
      mobile: number,
      country_code: countryCode,
      email: email,
      password: password,
      selectedCategories: selectedValuesArr,
    });
    APIWebCall.onRegisterAPICall(data)
      .then(async (response) => {
        console.log("[RegisterPage] Register Response:", response);
        const responseBody = response?.data || response;
        let verifyToken =
          responseBody?.verification_token ||
          responseBody?.data?.verification_token ||
          response?.verification_token ||
          response?.data?.verification_token;

        if (!verifyToken) {
          const cand =
            responseBody?.data?.token ||
            responseBody?.token ||
            response?.data?.token ||
            response?.token;
          if (
            cand &&
            typeof cand === "string" &&
            (cand.startsWith("token=") || cand.includes(":") || cand.length > 70)
          ) {
            verifyToken = cand;
          }
        }

        if (verifyToken) {
          if (typeof verifyToken === "string" && verifyToken.startsWith("token=")) {
            verifyToken = verifyToken.replace("token=", "");
          }
          console.log("[RegisterPage] Received verification_token from register1:", verifyToken);
          console.log("[RegisterPage] Triggering verification API with verification_token...");
          try {
            const verifyRes = await APIWebCall.onRegisterVerifiedAPICall(verifyToken);
            console.log("[RegisterPage] Verification Response:", verifyRes);
          } catch (verifyErr) {
            console.log("[RegisterPage] Verification Warning/Error:", verifyErr);
          }
        }

        if (email) {
          AsyncStorage.setItem("user_email", email.toString());
          AsyncStorage.setItem("username", email.toString());
        }

        if (
          responseBody?.sms_request_id != null ||
          responseBody?.data?.sms_request_id != null
        ) {
          setisLoading(false);
          AsyncStorage.removeItem("selected_category_ayy");
          navigation.navigate("OtpPage", {
            countryCode: countryCode,
            contact_no: number,
            sms_request_id: responseBody?.sms_request_id || responseBody?.data?.sms_request_id,
          });
        } else if (responseBody?.status === true) {
          setisLoading(false);
          AsyncStorage.removeItem("selected_category_ayy");
          showMessage({
            message: "Registration and verification successful! Please login with your password.",
            type: "success",
          });
          navigation.replace("LoginPage");
        } else {
          AsyncStorage.removeItem("selected_category_ayy");
          setTimeout(() => {
            showMessage({
              message: responseBody?.message || responseBody?.data?.message || "Registration failed",
              type: "danger",
            });
          }, 120);
        }
      })
      .catch((err) => {
        console.log("[RegisterPage] Register Error:", err);
        setisLoading(false);
        if (email) {
          AsyncStorage.setItem("user_email", email.toString());
          AsyncStorage.setItem("username", email.toString());
        }
        const errorData = err?.response?.data;
        let errMsg = "";
        if (errorData?.errors && typeof errorData.errors === "object") {
          const errorList = Object.values(errorData.errors).flat();
          if (errorList.length > 0) {
            errMsg = errorList.join("\n");
          }
        }
        if (!errMsg) {
          errMsg =
            errorData?.message ||
            errorData?.detail ||
            errorData?.error ||
            err?.message ||
            "Registration failed. Please try again.";
        }
        setTimeout(() => {
          showMessage({
            message: errMsg,
            type: "danger",
          });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  // const onLoginApiCall = (data, number) => {
  //   setisLoading(true);
  //   APIWebCall.onLoginAPICall_OTP(data)
  //     .then(async (response) => {
  //       setisLoading(false);

  //       if (response.status === true) {
  //         // AsyncStorage.setItem('user_id_save', response.id.toString());
  //         // console.log('user....id', response.id.toString());
  //         // AsyncStorage.setItem('user_token', response.token.toString());
  //         // console.log('user_token......', response.token.toString());
  //         if (number.includes("9998978397")) {
  //           if (number != null || number != undefined) {
  //             navigation.navigate("OtpPage", {
  //               details_id: "",
  //               contact_no: number
  //             });
  //           }
  //         } else {
  //           var res = response;
  //           if (res != null) {
  //             var res_otp = await CommonOTPAPiCall.onSendOTP_fornt_APICall(
  //               res.mobile
  //             );
  //             if (res_otp.Status === "Success") {
  //               navigation.navigate("OtpPage", {
  //                 details_id: res_otp.Details,
  //                 contact_no: res.mobile
  //               });
  //             }
  //           }
  //         }

  //         // navigation.navigate('AllTabs');
  //       }
  //     })
  //     .catch((err) => {
  //       setisLoading(false);
  //       setTimeout(() => {
  //         Snackbar.show({
  //           text: err.message,
  //           duration: Snackbar.LENGTH_LONG
  //         });
  //       }, 120);
  //     })
  //     .finally(() => setisLoading(false));
  // };

  const getInstagramFollowers = async () => {
    setInstagramFollowersError(null);
    setisLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        "https://i.instagram.com/api/v1/users/web_profile_info/?username=" +
        instagram_id,
      headers: {
        "user-agent":
          "Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)",
        Accept: "application/json",
      },
    };

    axios
      .request(config)
      .then((res) => {
        try {
          setInstagramFollowers(
            kFormatter(res.data.data.user.edge_followed_by.count)
          );
          setInstagramFollowersPassAPI(
            res.data.data.user.edge_followed_by.count
          );
          setInstagramFollowersError(null);
        } catch (error) {
          console.log("error ====> ", error);
          setInstagramFollowers(kFormatter("0"));
          setInstagramFollowersPassAPI("0");
          setInstagramFollowersError(
            "Please try later instagram server is not responding right now."
          );
        }
      })
      .catch((error) => {
        console.log("error:\n" + error);
        setInstagramFollowers(kFormatter("0"));
        setInstagramFollowersPassAPI("0");
        setInstagramFollowersError("Instagram id does not found");
      })
      .finally(() => {
        setisLoading(false);
        if (email) {
          AsyncStorage.setItem("user_email", email.toString());
          AsyncStorage.setItem("username", email.toString());
        }
      });
  };

  const statusView = (status, count, visible, txt) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: boxWidth,
            justifyContent: "center",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {/* <Image
              resizeMode="contain"
              source={
                status > count
                  ? require("../../assets/check_icon.png")
                  : status === count
                  ? require("../../assets/selected_icon.png")
                  : require("../../assets/unselcted_icon.png")
              }
              style={{
                width: 25,
                height: 25,
              }}
            /> */}

            <View
              style={{
                width: 35,
                height: 35,
                backgroundColor:
                  status > count
                    ? COLORS.color_469520
                    : status === count
                      ? COLORS.color_469520
                      : COLORS.blue_light,
                borderRadius: 35 / 2,
                justifyContent: "center",
              }}
            >
              <TextCommonMedium
                text={count}
                fontSize={FONTS_SIZE.txt_12}
                fontWeight={"500"}
                color={"white"}
                textAlign={"center"}
              />
            </View>

            <TextCommonMedium
              text={txt}
              fontSize={FONTS_SIZE.txt_12}
              fontWeight={"500"}
              color={
                status === count || status > count
                  ? COLORS.color_469520
                  : COLORS.blue_light
              }
              marginTop={5}
              numberOfLines={2}
              textAlign={"center"}
            />
          </View>

          {visible === false ? null : (
            <View
              style={{
                // width: 75,
                width: wp(20.5),
                height: 1,
                backgroundColor: COLORS.blue_light,
                position: "absolute",
                top: 15,
                left: boxWidth / 2 + 19,
                // left: 60,
              }}
            />
          )}
        </View>
      </View>
    );
  };

  const goToSelectionPage = (title) => {
    navigation.navigate("SelectCategoryPage", {
      title: title,
      selectedValuesArr,
    });
  };

  const filterItemView = (lable) => {
    return (
      <TouchableOpacity
        onPress={() => goToSelectionPage("Category")}
        activeOpacity={activeOpacity}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          paddingVertical: 15,
          paddingHorizontal: 15,
          width: wp("85%"),
          marginVertical: 5,
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: -2, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextCommonMedium
          text={lable}
          color={COLORS.black_txt}
          fontSize={FONTS_SIZE.txt_14}
          fontWeight={"500"}
        // marginLeft={1}
        />
        <Image
          source={require("../assets/next.png")}
          style={{
            width: 15,
            height: 15,
            position: "absolute",
            right: 15,
          }}
        />
      </TouchableOpacity>
    );
  };

  const accountView = (
    lable,
    placeHolder,
    onChangeText,
    value,
    keyboardType
  ) => {
    return (
      <View
      // style={{
      //   backgroundColor: COLORS.white_original,
      //   borderRadius: 8,
      //   paddingTop: 10,
      //   paddingHorizontal: 10,
      //   width: "100%",
      //   marginVertical: 5,
      //   shadowColor: COLORS.shadow_color,
      //   shadowOffset: { width: -2, height: 3 },
      //   shadowOpacity: 0.2,
      //   shadowRadius: 10,
      //   elevation: 3,
      // }}
      >
        <TextInputView
          text={lable}
          placeholder={placeHolder}
          onChangeText={onChangeText}
          secureTextEntry={false}
          value={value}
          keyboardType={keyboardType}
          multiline={false}
        />
      </View>
    );
  };

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require("../assets/bg_3.png")}
    >
      <View
        style={{
          flex: 1,
          flexGrow: 1,
        }}
      >
        <View>
          <ScrollView
            style={{ height: "100%", width: "100%" }}
            // contentContainerStyle={{ flex: 1, }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginLeft: 25, marginRight: 25, marginTop: 0 }}>
              <Image
                source={require("../assets/app_logo_2.png")}
                resizeMode={"contain"}
                style={{
                  height: 150,
                  width: 150,
                  alignSelf: "center",
                }}
              />

              <TextCommonSemiBlod
                text={"Register"}
                color={COLORS.black_txt}
                fontSize={FONTS_SIZE.txt_28}
                fontWeight={"500"}
                marginTop={0}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 15,
                }}
              >
                {statusView(statusProgressCount, 1, true, "Account")}
                {statusView(statusProgressCount, 2, true, "User Type")}
                {statusView(statusProgressCount, 3, false, "Social")}
              </View>

              {account === true ? (
                <View style={{ flex: 1 }}>
                  {accountView(
                    "Name*",
                    "Enter name",
                    (newText) => setFullName(newText),
                    full_name,
                    "default"
                  )}
                  {/* {accountView(
                    'Mobile Number*',
                    'Enter mobile number',
                    (newText) => setNumber(newText),
                    number,
                    'numeric'
                  )} */}

                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={number}
                    defaultCode={countryCode_}
                    layout="first"
                    onChangeText={(val) => setNumber(val)}
                    onChangeFormattedText={(text) => {
                      setCountryCode_(phoneInput.current?.getCountryCode());
                      setCountryCode(
                        phoneInput.current?.getCallingCode() || ""
                      );
                    }}
                    countryPickerProps={{ withAlphaFilter: true }}
                    placeholder={"Enter mobile number"}
                    textContainerStyle={{
                      backgroundColor: "transparent",
                    }}
                    codeTextStyle={{
                      fontSize: FONTS_SIZE.txt_14,
                      fontFamily: FONTS.FontMedium,
                      color: COLORS.black_txt,
                      marginLeft: -20,
                      height: Platform.OS === "android" ? 55 : 60,
                      textAlignVertical: "center",
                      marginTop: Platform.OS === "ios" ? 40 : 0,
                    }}
                    textInputStyle={{
                      fontSize: FONTS_SIZE.txt_14,
                      fontFamily: FONTS.FontMedium,
                      color: COLORS.black_txt,
                      height: Platform.OS === "android" ? 55 : 60,
                      includeFontPadding: false,
                      textAlignVertical: "center",
                    }}
                    containerStyle={{
                      height: 60,
                      width: "100%",
                      marginTop: 20,
                      flexDirection: "row",
                      backgroundColor: COLORS.white_original,
                      borderColor: COLORS.white_original,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      alignItems: "center",
                      paddingVertical: 10,
                      shadowColor: COLORS.shadow_color,
                      shadowOffset: { width: -2, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 10,
                      elevation: 3,
                    }}
                    withDarkTheme={false}
                    autoFocus
                  />
                </View>
              ) : null}
              {userType === true ? (
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 15,
                      borderRadius: 5,
                    }}
                  >
                    <RadioButton
                      onPress={() => {
                        setIsInfluencer(false), setBtnName("Register Now");
                      }}
                      visible={!isInfluencer}
                      text={"Normal User"}
                      image={require("../assets/user_register.png")}
                    />
                    <RadioButton
                      onPress={() => {
                        setIsInfluencer(true), setBtnName("Next");
                      }}
                      visible={isInfluencer}
                      text={"Influencer"}
                      image={require("../assets/influencer.png")}
                    />
                  </View>
                </View>
              ) : null}

              {socialFiled === true ? (
                <View style={{ flex: 1 }}>
                  {accountView(
                    "Instagram Id*",
                    "Enter Instagram Id",
                    (newText) => setInstagramId(newText),
                    instagram_id,
                    "default"
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "flex-end",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    {instagram_followers != "0" ? (
                      <TextCommonMedium
                        marginRight={15}
                        text={"Followers: " + instagram_followers}
                      />
                    ) : instagram_followers_Error != null ? (
                      <TextCommonMedium
                        marginRight={15}
                        fontSize={FONTS_SIZE.txt_12}
                        color={COLORS.color_red}
                        text={instagram_followers_Error}
                        textAlign={"center"}
                        width={wp(50)}
                      />
                    ) : null}
                    <ButtonView
                      backgroundColor={COLORS.colorGreen}
                      btnText={"Check"}
                      height={35}
                      btntxColor={COLORS.white_txt}
                      borderColor={COLORS.colorGreen}
                      onPress={() => getInstagramFollowers()}
                    />
                  </View>

                  {accountView(
                    "YouTube Channel",
                    "Enter youtube channel",
                    (newText) => setYouTubeId(newText),
                    youtube_id,
                    "default"
                  )}
                  {/* {accountView(
                "Twitter Username*",
                "Enter twitter username",
                (newText) => settwitterId(newText),
                twitterID,
                "default"
              )} */}
                  <View
                    style={{
                      paddingTop: 20,
                      // paddingLeft: 20,
                      paddingRight: 20,
                      paddingBottom: 10,
                      flex: 1,
                    }}
                  >
                    {filterItemView(
                      selectedValuesCat != null && selectedValuesCat != ""
                        ? selectedValuesCat
                        : "Category"
                    )}
                  </View>
                </View>
              ) : null}

              <View
                style={{
                  marginTop: 30,
                }}
              >
                <ButtonView
                  backgroundColor={COLORS.colorGreen}
                  btnText={btnName}
                  btntxColor={COLORS.white_txt}
                  borderColor={COLORS.colorGreen}
                  onPress={() => onRegisterAPICall()}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginTop: hp(1),
                marginBottom: hp(5),
              }}
            >
              <TextCommonMedium
                text={"Already have an account?"}
                color={COLORS.black_txt}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={"600"}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginPage")}
              >
                <TextCommonMedium
                  text={" Login"}
                  color={COLORS.black_txt}
                  fontSize={FONTS_SIZE.txt_15}
                  fontWeight={"600"}
                  textDecorationLine={"underline"}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {isDatePickerVisible === true ? (
          <View
            style={{
              backgroundColor: COLORS.bg_color,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            {Platform.OS === "ios" ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 10,
                  marginTop: 5,
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 3,
                    paddingBottom: 3,
                    borderRadius: 5,
                  }}
                >
                  <TextCommonregular
                    text={"Cancel"}
                    onClickText={() => {
                      setIsDatePickerVisible(false);
                    }}
                    color={COLORS.primary}
                    fontSize={FONTS_SIZE.txt_12}
                    fontWeight={"500"}
                    height={19}
                  />
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 3,
                    paddingBottom: 3,
                    borderRadius: 5,
                  }}
                >
                  <TextCommonregular
                    text={"Confirm"}
                    onClickText={() => {
                      setIsDatePickerVisible(false);
                    }}
                    color={COLORS.primary}
                    fontSize={FONTS_SIZE.txt_12}
                    fontWeight={"500"}
                    height={19}
                  />
                </View>
              </View>
            ) : null}

            <DateTimePicker
              value={birth_date === "" ? new Date() : new Date(birth_date)}
              mode={"date"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={false}
              onChange={onDateSelected}
              maximumDate={new Date()}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </View>
        ) : null}

        <ImagePickerCommon
          onImageSelectDone={onImageSelectDone}
          onImageSelectOpen={isImageSelectClick}
          setIsImageSelectClick={setIsImageSelectClick}
        />

        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
  );
}
export default RegisterPage;
