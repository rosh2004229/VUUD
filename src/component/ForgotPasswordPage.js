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
import { showMessage } from "react-native-flash-message";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SnackBarCommon from "../common/SnackBarCommon";
// import auth from '@react-native-firebase/auth';

function ForgotPasswordPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const onForgotPasswordClick = async () => {
    Keyboard.dismiss();
    console.log("[ForgotPasswordPage] onForgotPasswordClick triggered with email:", email);
    if (email === "") {
      showMessage({
        message: "Enter email",
        type: "danger",
      });
    } else if (validateFormCheck(email) === false) {
      showMessage({
        message: "Enter valid email",
        type: "danger",
      });
    } else {
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();

      if (isInternetGranted == true) {
        var data = new FormData();
        data.append("email", email);
        onForgot_Password_APICall(data);
      }
    }
  };

  const onForgot_Password_APICall = (data) => {
    setisLoading(true);
    console.log("[ForgotPasswordPage] Forgot Password API Triggered");
    console.log("[ForgotPasswordPage] Endpoint: forgotpassword");
    console.log("[ForgotPasswordPage] Full URL:", BASE_URL + "forgotpassword");
    console.log("[ForgotPasswordPage] Payload:", { email: email });
    APIWebCall.onForgot_Password_APICall(data)
      .then(async (response) => {
        // console.log("kkkkkkkkkkkk", response);
        setisLoading(false);
        console.log("[ForgotPasswordPage] Forgot Password Response:", response);
        if (response.data.status === true) {
          SnackBarCommon({ text: response.data.message, isSuccess: true });
          setTimeout(() => {
            navigation.navigate("LoginPage");
          }, 200);
        }
      })
      .catch((err) => {
        setisLoading(false);
        console.log("[ForgotPasswordPage] Forgot Password Error:", err);
        console.log({ err });
        setTimeout(() => {
          SnackBarCommon({ text: err.response.data.errors });
        }, 120);
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
              text={"Forgot password ?"}
              color={COLORS.black_txt}
              fontSize={FONTS_SIZE.txt_28}
              fontWeight={"500"}
              marginTop={0}
            />
            <View style={{}}>
              {accountView(
                "Enter email  ",
                (newText) => setEmail(newText),
                email,
                "email-address",
                () => {},
                false
              )}
            </View>
            <View
              style={{
                marginTop: 45,
              }}
            >
              <ButtonView
                backgroundColor={COLORS.colorGreen}
                btnText={"Forgot Password"}
                btntxColor={COLORS.white_txt}
                borderColor={COLORS.colorGreen}
                onPress={() => onForgotPasswordClick()}
                // onPress={() => navigation.navigate("OtpPage")}
              />
            </View>
          </View>
        </ScrollView>
        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
  );
}

export default ForgotPasswordPage;
