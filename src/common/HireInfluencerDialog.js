import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Alert,
  Image,
  BackHandler,
} from "react-native";
import { errormsgstyles } from "./errormsgstyles";
import {
  COLORS,
  FONTS,
  FONTS_SIZE,
  activeOpacity,
  dateDisplayFormate,
} from "./utils";
import TextInputView from "./TextInputView";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import SnackBarCommon from "./SnackBarCommon";
import Loader from "./LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetPermission from "./InternetPermission";
import APIWebCall from "./APIWebCall";
import LogoutDialog from "./LogoutDialog";
import TextCommonregular from "./TextCommonregular";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "@react-navigation/native";
import RequestDoneDialog from "./RequestDoneDialog";
import RequestSendSuccessful from "../component/RequestSendSuccessful";
import ButtonView from "./ButtonView";
import TextCommonMedium from "./TextCommonMedium";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function HireInfluencerDialog({
  navigation,
  isDialogVisible,
  otherUserId,
  onPressClose,
  onSubmitClose,
  otherUserName,
}) {
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [city, setCity] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isHireVisible, setIsHireVisible] = useState(false);
  const [responseText, setResponseText] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      setDate("");
      setPurpose("");
      setCity("");
      getSaveData();
    }, [isDialogVisible])
  );

  const getSaveData = async () => {
    var date_db = await AsyncStorage.getItem("date_db");
    var purpose_db = await AsyncStorage.getItem("purpose_db");
    var city_db_name = await AsyncStorage.getItem("city_edit");

    if (date_db != undefined) {
      setDate(date_db);
    }
    if (purpose_db != undefined) {
      setPurpose(purpose_db);
    }
    if (city_db_name != undefined) {
      setCity(city_db_name);
    }
  };

  const remove_db = async () => {
    AsyncStorage.removeItem("purpose_db");
    AsyncStorage.removeItem("date_db");
    AsyncStorage.removeItem("city_edit");
    AsyncStorage.removeItem("selectFilterCity_edit");
  };

  const onDateSelected = (event, value) => {
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false);
    }
    setDate(value);
  };

  const hireInfluencerApiCall = async () => {
    Keyboard.dismiss();
    var user_id = await AsyncStorage.getItem("user_id");
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    var data = new FormData();
    // data.append('user_id', user_id);
    // data.append('influencer_id', otherUserId);
    // data.append('date', moment(new Date(date)).format('yyyy-MM-DD'));
    // data.append('description', purpose);
    // data.append('city', city);
    data.append("sender_id", user_id);
    data.append("receiver_id", otherUserId);
    data.append("date", moment(new Date(date)).format("yyyy-MM-DD"));
    data.append("description", purpose);
    data.append("city", city);

    if (isInternetGranted == true) {
      setIsLoading(true);
      APIWebCall.onHireInfluencerAPICall(data)
        .then(async (response) => {
          setIsLoading(false);
          remove_db();
          setTimeout(() => {
            setIsHireVisible(true);
            setResponseText(response.message);
          }, 200);
        })
        .catch((err) => {
          setIsLoading(false);
          setTimeout(() => {
            SnackBarCommon({ text: err.message });
          }, 120);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const goToSelectionPage = (title) => {
    if (title === "City") {
      if (purpose != "") {
        AsyncStorage.setItem("purpose_db", purpose);
      }
      if (date != "") {
        AsyncStorage.setItem("date_db", date.toString());
      }
      if (city != "") {
        AsyncStorage.setItem("city_edit", city);
      }

      onPressClose();
      navigation.navigate("SelectCityPage", {
        title: title,
      });
    } else {
      // navigation.navigate('SelectCountryPage', {
      //   title: title,
      // });
      // navigation.navigate('SelectKeywordPage', {
      //   title: title,
      //   selectedValuesArr,
      // });
    }
  };

  const filterItemView = (lable, value) => {
    return (
      <TouchableOpacity
        onPress={() => goToSelectionPage(lable)}
        activeOpacity={activeOpacity}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          paddingVertical: 15,
          paddingHorizontal: 10,
          width: "100%",
          height: 65,
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
          text={value}
          color={COLORS.black_txt}
          fontSize={FONTS_SIZE.txt_14}
          fontWeight={"500"}
          width={wp(74.5)}
          marginLeft={1}
        />

        <Image
          source={require("../assets/next.png")}
          style={{
            width: 15,
            height: 15,
            position: "absolute",
            right: 15,
            tintColor: COLORS.gry_text,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        animationType="slide"
        visible={isDialogVisible}
        animated={true}
        onRequestClose={onPressClose}
        onSubmitClose={onSubmitClose}
        transparent={true}
      >
        <>
          {isDialogVisible === true && isHireVisible === false ? (
            <View style={errormsgstyles.errorMsgMainViewStyle}>
              <View
                style={{
                  width: "90%",
                  backgroundColor: COLORS.white_txt,
                  borderRadius: 15,
                  padding: 20,
                  height: hp(68),
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    color: COLORS.black_txt,
                    fontSize: FONTS_SIZE.txt_17,
                    marginRight: 10,
                    marginLeft: 10,
                    textAlign: "center",
                    fontFamily: FONTS.FontSemiBold,
                    fontWeight: "600",
                  }}
                >
                  Hire {otherUserName}
                </Text>

                <TouchableOpacity
                  onPress={() => setIsDatePickerVisible(true)}
                  activeOpacity={activeOpacity}
                >
                  <TextInputView
                    placeholder={"Select Date"}
                    onChangeText={() => {
                      setDate(newText);
                    }}
                    secureTextEntry={false}
                    value={
                      date != "" ? moment(date).format(dateDisplayFormate) : ""
                    }
                    text={"Date"}
                    editable={false}
                    keyboardType={"default"}
                    height={null}
                  />
                </TouchableOpacity>

                <TextInputView
                  placeholder={"Enter Purpose"}
                  onChangeText={(newText) => {
                    setPurpose(newText);
                  }}
                  secureTextEntry={false}
                  value={purpose}
                  text={"Purpose"}
                  editable={true}
                  keyboardType={"default"}
                  height={150}
                  multiline={true}
                />

                {/* <TextInputView
                    placeholder={'Enter City'}
                    onChangeText={(newText) => {
                      setCity(newText);
                    }}
                    secureTextEntry={false}
                    value={city}
                    text={'City'}
                    editable={true}
                    keyboardType={'default'}
                    height={null}
                    multiline={false}
                  /> */}

                <View
                  style={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    marginTop: 5,
                    //flex: 1,
                  }}
                >
                  {filterItemView("City", city != "" ? city : "City")}
                </View>

                <View
                  style={{
                    marginTop: 20,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 100,
                      paddingLeft: 15,
                      paddingRight: 15,
                      backgroundColor: COLORS.colorGreen,
                      padding: 3,
                      borderRadius: 5,
                    }}
                    activeOpacity={1}
                    onPress={() => {
                      //  onSubmitClose();
                      if (date === "") {
                        // SnackBarCommon({ text: 'Please select date' });
                        showMessage({
                          message: "Please select date",
                          type: "danger",
                        });
                      } else if (purpose === "") {
                        // SnackBarCommon({ text: 'Please enter purpose' });
                        showMessage({
                          message: "Please enter purpose",
                          type: "danger",
                        });
                      } else if (city === "") {
                        // SnackBarCommon({ text: 'Please enter city' });
                        showMessage({
                          message: "Please enter city",
                          type: "danger",
                        });
                      } else {
                        hireInfluencerApiCall();
                      }
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: COLORS.white_txt,
                        fontSize: FONTS_SIZE.txt_14,
                        fontFamily: FONTS.FontRegular,
                        alignSelf: "center",
                        padding: 2,
                      }}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      width: 100,
                      paddingLeft: 15,
                      paddingRight: 15,
                      backgroundColor: COLORS.gry_light,
                      borderRadius: 5,
                      marginLeft: 10,
                      padding: 3,
                    }}
                    activeOpacity={1}
                    onPress={() => {
                      remove_db(), onPressClose();
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: COLORS.white_txt,
                        fontSize: FONTS_SIZE.txt_14,
                        fontFamily: FONTS.FontRegular,
                        alignSelf: "center",
                        padding: 2,
                      }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
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
                    value={date === "" ? new Date() : new Date(date)}
                    mode={"date"}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    is24Hour={false}
                    onChange={onDateSelected}
                    minimumDate={new Date()}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </View>
              ) : null}

              <Loader loading={isLoading} />
            </View>
          ) : (
            <View style={errormsgstyles.errorMsgMainViewStyle}>
              <View
                style={{
                  ...errormsgstyles.errorMsgSecondViewStyle,
                  paddingBottom: 20,
                  paddingTop: 20,
                }}
              >
                <View style={{}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: COLORS.black_txt,
                      fontSize: FONTS_SIZE.txt_17,
                      marginRight: 10,
                      marginLeft: 10,
                      textAlign: "center",
                      fontFamily: FONTS.FontSemiBold,
                      fontWeight: "600",
                    }}
                  >
                    Hire {otherUserName}
                  </Text>
                  {responseText != null && responseText != "" ? (
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: COLORS.black,
                        fontSize: FONTS_SIZE.txt_15,
                        marginRight: 10,
                        marginLeft: 10,
                        textAlign: "center",
                        fontFamily: FONTS.FontRegular,
                        fontWeight: "500",
                        marginTop: 10,
                      }}
                    >
                      {responseText}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {
                    <TouchableOpacity
                      style={{
                        width: 80,
                        paddingLeft: 15,
                        paddingRight: 15,
                        backgroundColor: COLORS.colorGreen,
                        padding: 3,
                        borderRadius: 5,
                      }}
                      activeOpacity={1}
                      onPress={() => {
                        setIsHireVisible(false);
                        onPressClose();
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          color: COLORS.white_txt,
                          fontSize: FONTS_SIZE.txt_15,
                          fontFamily: FONTS.FontSemiBold,
                          alignSelf: "center",
                          padding: 2,
                        }}
                      >
                        {"OK"}
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </View>
          )}
        </>
      </Modal>
      {/* {
        isHireVisible === true && <RequestDoneDialog
          loading={isHireVisible}
          msg_text={responseText}
          // leftButtonText={"NO"}
          rightButtonText={"Ok"}
          onPressRightButton={() => {
            setIsHireVisible(false);
            setTimeout(() => {
              onPressClose()
            }, 200);
          }}
        // onPressLeftButton={() => {
        //   setIsHireVisible(false)
        //   setTimeout(() => {
        //     onPressClose()
        //   }, 200);
        // }
        // }
        />
      } */}
    </>
  );
}
