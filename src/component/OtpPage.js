import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import TextCommonMedium from "../common/TextCommonMedium";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import { BASE_URL, COLORS, FONTS, FONTS_SIZE, activeOpacity, elevation } from "../common/utils";

import {
  CodeField,
  Cursor,
  MaskSymbol,
  isLastFilledCell,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Loader from "../common/LoadingScreen";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import auth from '@react-native-firebase/auth';
import SnackBarCommon from "../common/SnackBarCommon";
import { showMessage } from "react-native-flash-message";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DialogForcefullyDetails from "../common/DialogForcefullyDetails";
import ButtonView from "../common/ButtonView";

function OtpPage({ route, navigation }) {
  const { contact_no, countryCode, sms_request_id, pin } = route.params;
  // const contact_no = null;
  // const countryCode = null
  // const sms_request_id = null;

  const [isLoading, setisLoading] = useState(false);
  const [details_id_state, setDetails_id_state] = useState("");
  const [sms_request_id_pass, setSms_request_id] = useState(sms_request_id);
  const [ClearInputsCode, setClearInputsCode] = useState(false);

  const [enterPin, setEnterPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const enterPinRef = useBlurOnFulfill({ value: enterPin, cellCount: 4 });
  const [enterPinProps, getEnterPinCellOnLayoutHandler] = useClearByFocusCell({
    value: enterPin,
    setValue: setEnterPin,
  });

  const confirmPinRef = useBlurOnFulfill({ value: confirmPin, cellCount: 4 });
  const [confirmPinProps, getConfirmPinCellOnLayoutHandler] = useClearByFocusCell({
    value: confirmPin,
    setValue: setConfirmPin,
  });

  const [isAPICall, setIsAPiCall] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // setDetails_id_state(details_id);
      onGetData();
      // setCodeValue("111111");
    }, 500);
  }, []);

  // useEffect(() => {
  //   if (isAPICall === true && codeValue.length === 4) {
  //     console.log("codeValue", codeValue);
  //     setTimeout(() => {
  //       onSubmitClick(codeValue)
  //     }, 1000);

  //   }

  // }, [isAPICall, codeValue]);

  const handleButton = () => {
    if (pin != undefined || pin != null) {
      if (enterPin.length === 4) {
        setTimeout(() => {
          onSubmitClick(enterPin);
        }, 1000);
      } else {
        showMessage({
          message: "Enter Pin",
          type: "danger",
        });
      }
    } else {
      if (confirmPin.length === 4 && enterPin == confirmPin) {
        // console.log("codeValue", codeValue);
        setTimeout(() => {
          onSubmitClick(confirmPin);
        }, 1000);
      } else {
        showMessage({
          message: "Enter Valid Pin",
          type: "danger",
        });
      }
    }
  };

  const onGetData = () => {
    if (contact_no.includes("7777777777")) {
      setCodeValue("1111");
      setEnterPin("1111");
      setTimeout(() => {
        onSubmitClick("1111");
      }, 1000);
    }
  };

  const onSubmitClick = async (code) => {
    console.log("[OtpPage] onSubmitClick triggered with code:", code);
    if (code != null) {
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();
      if (isInternetGranted == true) {
        var data = new FormData();
        data.append("request_id", sms_request_id_pass);
        data.append("otp", code);
        data.append("country_code", countryCode);
        data.append("mobile", contact_no);
        console.log(data);
        onVerifyApiCallAPI(data);
      }
    }
  };

  const onVerifyApiCallAPI = (data) => {
    setisLoading(true);
    setIsAPiCall(false);
    console.log("[OtpPage] Verify OTP API Triggered");
    console.log("[OtpPage] Endpoint: verifyOTP");
    console.log("[OtpPage] Full URL:", BASE_URL + "verifyOTP");
    console.log("[OtpPage] Payload:", {
      request_id: sms_request_id_pass,
      country_code: countryCode,
      mobile: contact_no,
    });

    APIWebCall.onVerifyApiCall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[OtpPage] Verify OTP Response:", response);
        console.log("response =====> ", JSON.stringify(response));
        console.log("response =====> ", JSON.stringify(response.data.user));
        console.log("response.data.token =====> ", response.data.token);
        console.log(
          "response?.data?.user?.user_type =====> ",
          response?.data?.user?.user_type
        );

        if (response.data.user != undefined) {
          AsyncStorage.setItem("user_token", response.data.token.toString());
          if (
            response.data.user.user_type != null ||
            response.data.user.user_type != undefined
          ) {
            AsyncStorage.setItem(
              "user_type",
              response?.data?.user?.user_type.toString()
            );
          }
          AsyncStorage.setItem("user_id", response.data.user.id.toString());
          if (response.data.user.is_confirm === 1) {
            // navigation.dispatch(StackActions.replace("Drawer_Menu"));
            navigation.reset({
              index: 0,
              routes: [{ name: 'Drawer_Menu' }],
            });
            AsyncStorage.setItem("is_confirm", "true");
          } else {
            AsyncStorage.setItem("is_confirm", "false");
            switch (response.data.user.step) {
              case 0:
                navigation.dispatch(StackActions.replace("NamePage"));
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
                navigation.dispatch(
                  StackActions.replace("CategorySelectRegisterPage")
                );
                break;
              case 5:
                navigation.dispatch(
                  StackActions.replace("AllMediaPicUploadPage")
                );
                break;
              case 6:
                navigation.dispatch(StackActions.replace("KeywordAddPage"));
                break;
              case 7:
                navigation.dispatch(
                  StackActions.replace("CityAndCountryAddPage")
                );
                break;
              default:
                break;
            }
          }
        } else {
          SnackBarCommon({ text: response.message });
        }
      })
      .catch((err) => {
        console.log("[OtpPage] Verify OTP Error:", err);
        setisLoading(false);
        SnackBarCommon({ text: "Invalid code." });
      })
      .finally(() => setisLoading(false));
  };

  const onResendOTP = (data) => {
    console.log("[OtpPage] Resend OTP API Triggered");
    console.log("[OtpPage] Endpoint: login1");
    console.log("[OtpPage] Full URL:", BASE_URL + "login1");
    console.log("[OtpPage] Payload:", {
      country_code: countryCode,
      mobile: contact_no,
    });
    APIWebCall.onLoginAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[OtpPage] Resend OTP Response:", response);
        console.log({ response });
        console.log(
          "response.data.user ==> ",
          JSON.stringify(response.sms_request_id)
        );

        if (
          response.sms_request_id != null ||
          response.sms_request_id != undefined
        ) {
          setSms_request_id(response.sms_request_id);
        }
      })
      .catch((err) => {
        console.log("[OtpPage] Resend OTP Error:", err);
        setisLoading(false);
        showMessage({
          message: err.message,
          type: "danger",
        });
      })
      .finally(() => setisLoading(false));
  };

  const onResendOtpClick = async () => {
    setisLoading(true);
    setCodeValue("");
    setEnterPin("");
    setConfirmPin("");
    setClearInputsCode(true);
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var data = new FormData();
      data.append("mobile", contact_no);
      data.append("country_code", countryCode);
      // onResendOTP(data);
    }
  };

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require("../assets/bg_3.png")}
    >
      <View
        style={{
          flex: 1,
          paddingTop: 15,
        }}
      >
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
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Image
            style={{
              height: 130,
              width: 130,
              marginTop: 20,
              alignSelf: "center",
              // tintColor: COLORS.black_txt,
            }}
            // resizeMode={'contain'}
            source={require("../assets/otp.png")}
          />
          <TextCommonSemiBlod
            text={"Enter Pin"}
            color={COLORS.black_txt}
            fontSize={FONTS_SIZE.txt_22}
            marginTop={30}
            marginLeft={47}
            fontWeight={"500"}
          />
          {/* <TextCommonMedium
            // text={'A 4 digit code has been sent to +91 ' + contact_no + '.'}
            text={
              'A 6 digit code has been sent to +' +
              countryCode +
              ' ' +
              contact_no +
              '.'
            }
            fontSize={FONTS_SIZE.txt_14}
            fontWeight={'400'}
            marginLeft={35}
            marginRight={20}
            color={COLORS.colorBlack}
          /> */}

          <View
            style={{
              borderRadius: 8,
              shadowColor: COLORS.shadow_color,
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              // elevation: elevation,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <CodeField
              ref={enterPinRef}
              {...enterPinProps}
              value={enterPin}
              onChangeText={(val) => {
                setClearInputsCode(false);
                setEnterPin(val);
              }}
              cellCount={4}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoFocus={true}
              renderCell={({ index, symbol, isFocused }) => {
                let textChild = null;
                if (symbol) {
                  textChild = (
                    <MaskSymbol
                      maskSymbol="•"
                      isLastFilledCell={isLastFilledCell({ index, value: enterPin })}
                    >
                      {symbol}
                    </MaskSymbol>
                  );
                } else if (isFocused) {
                  textChild = <Cursor />;
                }
                return (
                  <View
                    key={index}
                    style={[styles.otpStyle, isFocused && styles.focusCell]}
                    onLayout={getEnterPinCellOnLayoutHandler(index)}
                  >
                    <Text style={styles.cellText}>{textChild}</Text>
                  </View>
                );
              }}
            />
          </View>

          {pin === null || pin === undefined || pin === "" || pin === "null" ? (
            <>
              <TextCommonSemiBlod
                text={"Confirm Pin"}
                color={COLORS.black_txt}
                fontSize={FONTS_SIZE.txt_22}
                marginTop={20}
                marginLeft={48}
                fontWeight={"500"}
              />

              <View
                style={{
                  borderRadius: 8,
                  shadowColor: COLORS.shadow_color,
                  shadowOffset: { width: -2, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  // elevation: elevation,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <CodeField
                  ref={confirmPinRef}
                  {...confirmPinProps}
                  value={confirmPin}
                  onChangeText={(val) => {
                    setClearInputsCode(false);
                    setConfirmPin(val);
                  }}
                  cellCount={4}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({ index, symbol, isFocused }) => {
                    let textChild = null;
                    if (symbol) {
                      textChild = (
                        <MaskSymbol
                          maskSymbol="•"
                          isLastFilledCell={isLastFilledCell({ index, value: confirmPin })}
                        >
                          {symbol}
                        </MaskSymbol>
                      );
                    } else if (isFocused) {
                      textChild = <Cursor />;
                    }
                    return (
                      <View
                        key={index}
                        style={[styles.otpStyle, isFocused && styles.focusCell]}
                        onLayout={getConfirmPinCellOnLayoutHandler(index)}
                      >
                        <Text style={styles.cellText}>{textChild}</Text>
                      </View>
                    );
                  }}
                />
              </View>
            </>
          ) : null}

          <View
            style={{
              marginTop: 25,
              marginHorizontal: 30,
            }}
          >
            <ButtonView
              backgroundColor={COLORS.colorGreen}
              btnText={"Continue"}
              btntxColor={COLORS.white_txt}
              borderColor={COLORS.colorGreen}
              onPress={() => handleButton()}
            />
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <TextCommonMedium
              text={"If you didn't receive a code!"}
              fontSize={FONTS_SIZE.txt_14}
              fontWeight={'400'}
              color={COLORS.colorBlack}
            />
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              activeOpacity={activeOpacity}
              onPress={() => {
                onResendOtpClick();
              }}
            >
              <TextCommonSemiBlod
                text={'Resend'}
                fontSize={FONTS_SIZE.txt_16}
                fontWeight={'600'}
                color={COLORS.colorPrimary}
              />
            </TouchableOpacity>
          </View> */}
          <Loader loading={isLoading} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {
    width: "75%",
    marginTop: 10,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  otpStyle: {
    height: 50,
    width: 50,
    borderRadius: 5,
    backgroundColor: COLORS.white_original,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow_color,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  focusCell: {
    borderColor: COLORS.colorPrimary || "#000",
  },
  cellText: {
    fontFamily: FONTS.FontSemiBold,
    fontSize: 20,
    textAlign: "center",
    color: COLORS.black_txt,
  },
});

export default OtpPage;
