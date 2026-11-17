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
  validateFormCheck,
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
import LogoutDialog from "../common/LogoutDialog";

function SignUp({ navigation }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [PasswordEye, setPasswordEye] = useState(false);
  const [number, setNumber] = useState("");
  // const [number, setNumber] = useState('9685741263');
  const [isCheckbox, setIScheckBox] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const phoneInput = useRef(null);
  const [countryCode, setCountryCode] = useState("91");
  const [countryCode_, setCountryCode_] = useState("IN");
  const [isAPICall, setIsAPiCall] = useState(false);
  const [signuplModelVisible, setsignupModelVisible] = useState(false);

  useEffect(() => {
    // analyticsLog('Login_screen');
    //onGetData();
  }, []);

  const onLoginClick = async () => {
    Keyboard.dismiss();
    console.log("[SignUp] onLoginClick triggered:", {
      number,
      email,
      countryCode,
      isCheckbox,
    });
    if (number === "") {
      showMessage({
        message: "Enter mobile number",
        type: "danger",
      });
    } else if (number.length != 10) {
      showMessage({
        message: "Enter valid mobile number",
        type: "danger",
      });
    } else if (email === "") {
      showMessage({
        message: "Enter email",
        type: "danger",
      });
    } else if (validateFormCheck(email) === false) {
      showMessage({
        message: "Enter valid email",
        type: "danger",
      });
    } else if (password === "") {
      showMessage({
        message: "Enter password",
        type: "danger",
      });
    } else if (confirmpassword === "") {
      showMessage({
        message: "Enter confirm password",
        type: "danger",
      });
    } else if (password !== confirmpassword) {
      showMessage({
        message: "Passwords do not match",
        type: "danger",
      });
    }
    // } else if (password === '') {
    //   Snackbar.show({
    //     text: 'Enter password',
    //     duration: Snackbar.LENGTH_LONG,
    //   });
    // }
    else if (isCheckbox === false) {
      showMessage({
        message: "Please agree to Influenstar terms and policy",
        type: "danger",
      });
    } else {
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();
      if (!isInternetGranted) return;

      const fmtCountryCode = countryCode.startsWith("+") ? countryCode : `+${countryCode}`;
      const payload = {
        email: email.trim(),
        mobile: number.trim(),
        country_code: fmtCountryCode,
        password: password,
      };

      onSignUpAPICall(payload);
    }
  };

  const onSignUpAPICall = (data) => {
    setisLoading(true);
    console.log("[SignUp] Sign Up API Triggered");
    console.log("[SignUp] Endpoint: register1");
    console.log("[SignUp] Full URL:", BASE_URL + "register1");
    console.log("[SignUp] Payload:", data);
    APIWebCall.onRegisterAPICall(data)
      .then(async (response) => {
        console.log("[SignUp] Sign Up Response:", response);
        const responseBody = response?.data || response;
        const isSuccess = responseBody?.status === true || response?.status === 200;

        if (isSuccess) {
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
            console.log("[SignUp] Received verification_token from register1:", verifyToken);
            console.log("[SignUp] Triggering verification API with verification_token...");

            try {
              const verifyRes = await APIWebCall.onRegisterVerifiedAPICall(verifyToken);
              console.log("[SignUp] Verification Response:", verifyRes);
            } catch (verifyErr) {
              console.log("[SignUp] Verification Warning/Error:", verifyErr);
            }
          }

          if (email) {
            AsyncStorage.setItem("user_email", email.toString());
            AsyncStorage.setItem("username", email.toString());
          }

          setisLoading(false);
          showMessage({
            message: "Registration and verification successful! Please login with your password.",
            type: "success",
          });
          navigation.replace("LoginPage");
        } else {
          setisLoading(false);
          SnackBarCommon({ text: responseBody?.message || "Registration failed" });
        }
        // if (
        //     response.sms_request_id != null ||
        //     response.sms_request_id != undefined
        // ) {

        //     // console.log('response.data.user.pin', response.data.user.pin);
        //     // // navigation.navigate('OtpPage', {
        //     // //     countryCode: countryCode,
        //     // //     contact_no: number,
        //     // //     sms_request_id: response.sms_request_id,
        //     // //     pin: response.data.user.pin,
        //     // // });
        // }

        // if (response.data.user != undefined) {
        //   AsyncStorage.setItem('user_token', response.data.token.toString());
        //   AsyncStorage.setItem(
        //     'user_type',
        //     response.data.user.user_type.toString()
        //   );
        //   AsyncStorage.setItem('user_id', response.data.user.id.toString());
        //   // AsyncStorage.setItem(
        //   //   "user_data",
        //   //   JSON.stringify(response.data.user.toString())
        //   // );

        //   // if (number.includes("9998978397")) {
        //   //   if (number != null || number != undefined) {
        //   //     navigation.navigate("OtpPage", {
        //   //       details_id: "",
        //   //       contact_no: number
        //   //     });
        //   //   }
        //   // } else {
        //   //   var res = response;
        //   //   if (res != null) {
        //   //     var res_otp = await CommonOTPAPiCall.onSendOTP_fornt_APICall(
        //   //       res.mobile
        //   //     );
        //   //     if (res_otp.Status === "Success") {
        //   //       navigation.navigate("OtpPage", {
        //   //         details_id: res_otp.Details,
        //   //         contact_no: res.mobile
        //   //       });
        //   //     }
        //   //   }
        //   // }
        //   showMessage({
        //     message: 'Login Successful',
        //     type: 'success',
        //   });

        //   navigation.navigate('Drawer_Menu');
        // }
      })
      .catch((err) => {
        console.log("[SignUp] Sign Up Error:", err);
        setisLoading(false);
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
        showMessage({
          message: errMsg,
          type: "danger",
        });
      })
      .finally(() => setisLoading(false));
  };

  const accountView = (
    //lable,
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
          // paddingTop: 8,
          // paddingHorizontal: 10,
          width: "125%",
          // justifyContent: 'center',
          //alignItems: 'center'
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
          //secureTextEntry={lable === "Confirm password" && !confirmpasswordHide}
          isPassword={isPassword}
          value={value}
          // editable={keyboardType === "null" ? false : true}
          keyboardType={keyboardType === "null" ? "default" : keyboardType}
          //height={lable === "About" ? 150 : null}
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
      <View style={{ flex: 1 }}>
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
              //resizeMode={"contain"}
              style={{ height: 130, width: 250, alignSelf: "center" }}
            />
            <TextCommonSemiBlod
              text={"Welcome"}
              color={COLORS.black_txt}
              fontSize={FONTS_SIZE.txt_28}
              fontWeight={"500"}
              marginTop={0}
            />
            <TextCommonMedium
              text={"Create a new account ! "}
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
            {accountView(
              "Enter email  ",
              (newText) => setEmail(newText),
              email,
              "email-address",
              () => {},
              false
            )}
            {accountView(
              "Enter password",
              (newText) => setPassword(newText),
              password,
              "",
              () => {},
              false,
              true
            )}
            {accountView(
              "Enter confirm password",
              (newText) => setconfirmPassword(newText),
              confirmpassword,
              "",
              () => {},
              false,
              true
            )}

            <View
              style={{
                marginTop: 50,
              }}
            >
              <ButtonView
                backgroundColor={COLORS.colorGreen}
                btnText={"Register"}
                btntxColor={COLORS.white_txt}
                borderColor={COLORS.colorGreen}
                onPress={() => onLoginClick()}
                // onPress={() => navigation.navigate("OtpPage")}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: hp(5),
              paddingBottom: 30,
            }}
          >
            <TextCommonMedium
              text={"Don't have an account?"}
              color={COLORS.black_txt}
              fontSize={FONTS_SIZE.txt_15}
              fontWeight={"600"}
            />
            <TouchableOpacity onPress={() => navigation.replace("LoginPage")}>
              <TextCommonMedium
                marginLeft={5}
                text={"Login"}
                color={COLORS.color_red}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={"600"}
                textDecorationLine={"underline"}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Loader loading={isLoading} />
        <LogoutDialog
          loading={signuplModelVisible}
          // msg_title={"Delete Account!"}
          msg_text={
            "Your account has been successfully created. Please verify your account from email."
          }
          //leftButtonText={"OK"}
          rightButtonText={"OK"}
          onPressRightButton={() => {
            setsignupModelVisible(false), navigation.replace("LoginPage");
          }}
          //onPressLeftButton={() => { setsignupModelVisible(false), navigation.replace("LoginPage") }}
        />
      </View>
    </ImageBackground>
  );
}

export default SignUp;
