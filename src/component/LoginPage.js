import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  ImageBackground,
  Keyboard,
} from "react-native";
import Snackbar from "react-native-snackbar";
import ButtonView from "../common/ButtonView";
import TextCommonregular from "../common/TextCommonregular";
import TextCommonMedium from "../common/TextCommonMedium";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import TextInputView from "../common/TextInputView";
import {
  BASE_URL,
  COLORS,
  FONTS,
  FONTS_SIZE,
  PRIVACY_POLICY,
  TERMS_CONDITION,
  activeOpacity,
  analyticsLog,
} from "../common/utils";
import APIWebCall from "../common/APIWebCall";
import InternetPermission from "../common/InternetPermission";
import Loader from "../common/LoadingScreen";
import CommonOTPAPiCall from "../common/CommonOTPAPiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DialogView from "../common/DialogView";
import { showMessage } from "react-native-flash-message";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SnackBarCommon from "../common/SnackBarCommon";
// import auth from '@react-native-firebase/auth';
import PhoneInput from "react-native-phone-number-input";
import { StackActions } from "@react-navigation/native";

function LoginPage({ navigation }) {
  const [password, setPassword] = useState("Password123");
  const [number, setNumber] = useState("8780630153");
  // const [number, setNumber] = useState('9685741263');
  const [isCheckbox, setIScheckBox] = useState(true);
  const [isLoading, setisLoading] = useState(false);

  const phoneInput = useRef(null);
  const [countryCode, setCountryCode] = useState("91");
  const [countryCode_, setCountryCode_] = useState("IN");

  useEffect(() => {
    analyticsLog("Login_screen");
  }, []);

  const onLoginClick = async () => {
    Keyboard.dismiss();
    console.log("[LoginPage] onLoginClick button pressed with:", {
      number,
      password,
      isCheckbox,
      countryCode,
    });
    if (number.trim() === "") {
      showMessage({
        message: "Enter mobile number",
        type: "danger",
      });
    } else if (number.trim().length !== 10) {
      showMessage({
        message: "Enter valid mobile number",
        type: "danger",
      });
    } else if (password.trim() === "") {
      showMessage({
        message: "Enter password",
        type: "danger",
      });
    } else if (isCheckbox === false) {
      showMessage({
        message: "Please agree to Influenstar terms and policy",
        type: "danger",
      });
    } else {
      const isInternetGranted =
        await InternetPermission.checkInternetPermissions();
      if (isInternetGranted === true) {
        const payload = {
          mobile: number.trim(),
          password: password,
        };
        onLoginApiCall(payload);
      }
    }
  };

  const onLoginApiCall = async (payload) => {
    setisLoading(true);
    console.log("[LoginPage] API Call Triggered");
    console.log("[LoginPage] Full URL:", BASE_URL + "login1");
    console.log("[LoginPage] Payload:", payload);

    const handleLoginSuccess = async (loginResponse) => {
      const responseBody = loginResponse?.data || loginResponse;
      const user = responseBody?.user || loginResponse?.user;
      const authToken = responseBody?.token || loginResponse?.token;

      if (user != undefined) {
        if (authToken) {
          await AsyncStorage.setItem("user_token", authToken.toString());
        }
        if (user.user_type != null && user.user_type != undefined) {
          await AsyncStorage.setItem("user_type", user.user_type.toString());
        }
        if (user.id != null) {
          await AsyncStorage.setItem("user_id", user.id.toString());
        }
        if (user.email) {
          await AsyncStorage.setItem("user_email", user.email.toString());
          await AsyncStorage.setItem("username", user.email.toString());
        }
        if (user.username) {
          await AsyncStorage.setItem("username", user.username.toString());
        }

        const isConfirmed = Number(user.is_confirm) === 1;
        if (isConfirmed) {
          await AsyncStorage.setItem("is_confirm", "true");
          navigation.reset({
            index: 0,
            routes: [{ name: "Drawer_Menu" }],
          });
        } else {
          await AsyncStorage.setItem("is_confirm", "false");
          const step = Number(user.step);
          switch (step) {
            case 0:
              navigation.dispatch(StackActions.replace("NamePage", {
                user_id: user.id,
                email: user.email,
                username: user.username || user.email,
              }));
              break;
            case 1:
              navigation.dispatch(StackActions.replace("ProfilePicUpload"));
              break;
            case 2:
              navigation.dispatch(StackActions.replace("TypeSelect"));
              break;
            case 3:
              navigation.dispatch(StackActions.replace("InstaCountAddPage"));
              break;
            case 4:
              navigation.dispatch(StackActions.replace("CategorySelectRegisterPage"));
              break;
            case 5:
              navigation.dispatch(StackActions.replace("AllMediaPicUploadPage"));
              break;
            case 6:
              navigation.dispatch(StackActions.replace("KeywordAddPage"));
              break;
            case 7:
              navigation.dispatch(StackActions.replace("CityAndCountryAddPage"));
              break;
            default:
              navigation.dispatch(StackActions.replace("NamePage", {
                user_id: user.id,
                email: user.email,
                username: user.username || user.email,
              }));
              break;
          }
        }
        return true;
      }
      return false;
    };

    try {
      const response = await APIWebCall.onLoginAPICall(payload);
      console.log("[LoginPage] onLoginAPICall Response:", response);

      if (response && response.status === true) {
        showMessage({
          message: response.message || "Login successfully.",
          type: "success",
        });
        await handleLoginSuccess(response);
      } else {
        const errMsg = response?.message || "Login failed";
        showMessage({
          message: errMsg,
          type: "danger",
        });
      }
    } catch (err) {
      console.log("[LoginPage] onLoginAPICall Error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        (typeof err === "string" ? err : null) ||
        "Login failed";
      showMessage({
        message: errMsg,
        type: "danger",
      });
    } finally {
      setisLoading(false);
    }
  };

  const accountView = (
    // lable,
    placeHolder,
    onChangeText,
    value,
    keyboardType,
    onPressClick,
    multiline,
    isPassword
  ) => {
    return (
      <View
        style={{
          // backgroundColor: COLORS.white_txt,
          // borderRadius: 8,
          // paddingTop: 10,
          // paddingHorizontal: 10,
          width: "125%",
          // justifyContent: 'center',
          // alignItems: 'center'
          // // height: lable === 'About' ? 200 : null,
          // marginVertical: 3,
          // shadowColor: COLORS.shadow_color,
          // shadowOffset: { width: -2, height: 3 },
          // shadowOpacity: 0.2,
          // shadowRadius: 10,
          // elevation: elevation
        }}
      >
        <TextInputView
          //text={lable}
          placeholder={placeHolder}
          onChangeText={onChangeText}
          // secureTextEntry={lable === "Password" && !passwordHide}
          value={value}
          isPassword={isPassword}
          // editable={keyboardType === "null" ? false : true}
          keyboardType={keyboardType === "null" ? "default" : keyboardType}
          // height={lable === "About" ? 150 : null}
          multiline={multiline}
        />
      </View>
    );
  };
  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require("../assets/bg_3.png")}
    >
      <View style={{ flex: 1, paddingTop: 15 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack(null)}
          style={{
            width: 35,
            height: 35,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginTop: Platform.OS === "ios" ? 45 : 0,
            borderRadius: 30,
            //marginTop: 20,
            backgroundColor: COLORS.very_light_grey,
            //elevation: 3,
          }}
        >
          <Image
            style={{ width: 13, height: 13, tintColor: COLORS.black_txt }}
            resizeMode={"contain"}
            source={require("../assets/back.png")}
          />
        </TouchableOpacity>
        <ScrollView style={{ height: "100%", width: "100%" }}>
          <View style={{ marginLeft: 25, marginRight: 25, marginTop: 5 }}>
            <Image
              source={require("../assets/app_logo.png")}
              // resizeMode={"contain"}
              style={{
                height: 130,
                width: 250,
                marginBottom: 5,
                alignSelf: "center",
              }}
            />
            <TextCommonSemiBlod
              text={"Welcome"}
              color={COLORS.black_txt}
              fontSize={FONTS_SIZE.txt_28}
              fontWeight={"500"}
              marginTop={0}
            />
            <TextCommonMedium
              text={"Login into your Account ! "}
              color={COLORS.gry_text}
              fontSize={FONTS_SIZE.txt_14}
              fontWeight={"400"}
              marginLeft={5}
            />
            {/* <TextInputView
              placeholder={'Enter mobile number'}
              onChangeText={(newText) => setNumber(newText)}
              secureTextEntry={false}
              value={number}
              text={'Mobile Number'}
              keyboardType={'numeric'}
            /> */}
            <PhoneInput
              ref={phoneInput}
              defaultValue={number}
              defaultCode={countryCode_}
              layout="first"
              onChangeText={(val) => setNumber(val)}
              onChangeFormattedText={(text) => {
                setCountryCode_(phoneInput.current?.getCountryCode());
                setCountryCode(phoneInput.current?.getCallingCode() || "");
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
                height: Platform.OS === "android" ? 55 : 55,
                textAlignVertical: "center",
                marginTop: Platform.OS === "ios" ? 35 : 0,
              }}
              textInputStyle={{
                fontSize: FONTS_SIZE.txt_14,
                fontFamily: FONTS.FontMedium,
                color: COLORS.black_txt,
                height: Platform.OS === "android" ? 55 : 55,
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
            {accountView(
              "Enter password",
              (newText) => setPassword(newText),
              password,
              "",
              () => { },
              false,
              true
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPasswordPage")}
              style={{
                marginTop: 10,
                alignSelf: "flex-end",
              }}
            >
              <TextCommonMedium
                text={"Forgot Password ?"}
                color={COLORS.color_red}
                fontSize={FONTS_SIZE.txt_14}
                fontWeight={"400"}
                marginLeft={5}
              />
            </TouchableOpacity>
            <View
              style={{
                marginTop: 30,
              }}
            >
              <ButtonView
                backgroundColor={COLORS.colorGreen}
                btnText={"Continue"}
                btntxColor={COLORS.white_txt}
                borderColor={COLORS.colorGreen}
                onPress={() => onLoginClick()}
              // onPress={() => navigation.navigate("OtpPage")}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                padding: 5,
              }}
              onPress={() => setIScheckBox(!isCheckbox)}
            >
              <Image
                style={{
                  height: 23,
                  width: 23,
                }}
                source={
                  isCheckbox === true
                    ? require("../assets/check_box_icon.png")
                    : require("../assets/uncheck_box_icon.png")
                }
              />
            </TouchableOpacity>
            <View
              style={{
                marginLeft: 2,
              }}
            >
              <TextCommonMedium
                text={"By continue, you are agree to Influenstar"}
                color={COLORS.colorBlack}
                fontSize={FONTS_SIZE.txt_13}
                fontWeight={"400"}
              />
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={() =>
                    navigation.navigate("PACPage", {
                      text: "Terms & Condition",
                      link: TERMS_CONDITION,
                    })
                  }
                >
                  <TextCommonMedium
                    text={"Terms & Condition "}
                    color={COLORS.colorAccent}
                    fontSize={FONTS_SIZE.txt_13}
                    fontWeight={"400"}
                    textDecorationLine={"underline"}
                  />
                </TouchableOpacity>
                <TextCommonMedium
                  text={" and "}
                  color={COLORS.colorBlack}
                  fontSize={FONTS_SIZE.txt_14}
                  fontWeight={"400"}
                />
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={() =>
                    navigation.navigate("PACPage", {
                      text: "Privacy & Policy",
                      link: PRIVACY_POLICY,
                    })
                  }
                >
                  <TextCommonMedium
                    text={" Privacy Policy"}
                    color={COLORS.colorAccent}
                    fontSize={FONTS_SIZE.txt_14}
                    fontWeight={"400"}
                    textDecorationLine={"underline"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: hp(5),
              paddingBottom: 30,
            }}
          >
            <TextCommonMedium
              text={"Don't have an account?"}
              color={COLORS.black_txt}
              fontSize={FONTS_SIZE.txt_15}
              fontWeight={'600'}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterPage')}
            >
              <TextCommonMedium
                text={' Register'}
                color={COLORS.black_txt}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={'600'}
                textDecorationLine={'underline'}
              />
            </TouchableOpacity>
          </View> */}
        </ScrollView>
        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
  );
}

export default LoginPage;
