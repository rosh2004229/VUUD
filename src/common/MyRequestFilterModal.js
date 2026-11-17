import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { errormsgstyles } from "./errormsgstyles";
import Loader from "./LoadingScreen";
import TextCommonMedium from "./TextCommonMedium";
import TextCommonregular from "./TextCommonregular";
import TextInputView from "./TextInputView";
import {
  COLORS,
  FONTS,
  FONTS_SIZE,
  activeOpacity,
  dateDisplayFormate,
} from "./utils";

export default function MyRequestFilterModal({
  navigation,
  isDialogVisible,
  onPressClose,
  onSubmitClose,
  modalTitle,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [city, setCity] = useState("");
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
    useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // setStartDate("");
      // setEndDate("");
      setCity("");
      getSaveData();
    }, [isDialogVisible])
  );

  const getSaveData = async () => {
    var city_db_name = await AsyncStorage.getItem("city_edit");
    if (city_db_name != undefined) {
      setCity(city_db_name);
    }
  };

  const onSubmitClick = () => {
    if (startDate === "" && endDate === "" && city === "") {
      showMessage({
        message: "Please select either date or city ",
        type: "danger",
      });
    } else if (endDate === "" && startDate != "") {
      showMessage({
        message: "Please select the end date",
        type: "danger",
      });
    } else if (endDate != "" && startDate === "") {
      showMessage({
        message: "Please select start date",
        type: "danger",
      });
    } else {
      onSubmitClose(
        city,
        startDate != "" ? moment(startDate).format("YYYY-MM-DD") : "",
        endDate != "" ? moment(endDate).format("YYYY-MM-DD") : ""
      );
      remove_db();
    }
  };

  const remove_db = () => {
    setStartDate("");
    setEndDate("");
    AsyncStorage.removeItem("city_edit");
    AsyncStorage.removeItem("selectFilterCity_edit");
  };

  const onStartDateSelected = (event, value) => {
    if (Platform.OS === "android") {
      setIsStartDatePickerVisible(false);
    }
    setStartDate(value);
  };
  const onEndDateSelected = (event, value) => {
    if (Platform.OS === "android") {
      setIsEndDatePickerVisible(false);
    }
    setEndDate(value);
  };

  const goToSelectionPage = (title) => {
    if (title === "City") {
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
        modalTitle={modalTitle}
        transparent={true}
      >
        <>
          <View style={errormsgstyles.errorMsgMainViewStyle}>
            <View
              style={{
                width: "90%",
                backgroundColor: COLORS.white_txt,
                borderRadius: 15,
                padding: 20,
                height: hp(45),
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
                {modalTitle}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsStartDatePickerVisible(true)}
                  activeOpacity={activeOpacity}
                  style={{ flex: 1, paddingRight: 6 }}
                >
                  <TextInputView
                    placeholder={"Select Start Date"}
                    onChangeText={() => {
                      setStartDate(newText);
                    }}
                    secureTextEntry={false}
                    value={
                      startDate != ""
                        ? moment(startDate).format(dateDisplayFormate)
                        : ""
                    }
                    text={"Start Date"}
                    editable={false}
                    keyboardType={"default"}
                    height={null}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsEndDatePickerVisible(true)}
                  activeOpacity={activeOpacity}
                  style={{ flex: 1 }}
                >
                  <TextInputView
                    placeholder={"Select End Date"}
                    onChangeText={() => {
                      setEndDate(newText);
                    }}
                    secureTextEntry={false}
                    value={
                      endDate != ""
                        ? moment(endDate).format(dateDisplayFormate)
                        : ""
                    }
                    text={"End Date"}
                    editable={false}
                    keyboardType={"default"}
                    height={null}
                  />
                </TouchableOpacity>
              </View>

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
                    onSubmitClick();
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

            {isStartDatePickerVisible === true ? (
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
                          setIsStartDatePickerVisible(false);
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
                          setIsStartDatePickerVisible(false);
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
                  value={startDate === "" ? new Date() : new Date(startDate)}
                  mode={"date"}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  is24Hour={false}
                  onChange={onStartDateSelected}
                  maximumDate={new Date()}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </View>
            ) : null}
            {isEndDatePickerVisible === true ? (
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
                          setIsEndDatePickerVisible(false);
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
                          setIsEndDatePickerVisible(false);
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
                  value={endDate === "" ? new Date() : new Date(endDate)}
                  mode={"date"}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  is24Hour={false}
                  onChange={onEndDateSelected}
                  minimumDate={startDate != "" ? startDate : new Date()}
                  maximumDate={new Date()}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </View>
            ) : null}

            <Loader loading={isLoading} />
          </View>
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
