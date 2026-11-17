import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ButtonView from '../../common/ButtonView';
import Loader from '../../common/LoadingScreen';
import TextCommonMedium from '../../common/TextCommonMedium';
import TextInputView from '../../common/TextInputView';
import { BASE_URL, COLORS, FONTS, FONTS_SIZE, activeOpacity, dateDisplayFormate } from '../../common/utils';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ToolbarBackButton from '../../common/ToolbarBackButton';
import statusView from '../../common/statusView';
let { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import InternetPermission from '../../common/InternetPermission';
import APIWebCall from '../../common/APIWebCall';
import TextCommonregular from '../../common/TextCommonregular';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment/moment";

let boxCount = 2;
let boxWidth = width / boxCount;

function NamePage({ navigation, route }) {
  const [full_name, setFullName] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [statusProgressCount, setStatusProgressCount] = useState(1);
  const [birth_date, setBirthDate] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [gender, setGender] = useState("female");

  useEffect(() => {}, []);

  const onNextClick = async () => {
    Keyboard.dismiss();
    if (!full_name || full_name.trim() === '') {
      showMessage({
        message: 'Enter name',
        type: 'danger',
      });
      return;
    }

    if (!birth_date || birth_date === "") {
      showMessage({
        message: 'Enter birthdate',
        type: 'danger',
      });
      return;
    }

    if (!gender) {
      showMessage({
        message: 'Select gender',
        type: 'danger',
      });
      return;
    }

    var user_id =
      (await AsyncStorage.getItem('user_id')) ||
      route?.params?.user_id;

    if (!user_id) {
      showMessage({
        message: 'User session not found. Please login again.',
        type: 'danger',
      });
      navigation.replace('LoginPage');
      return;
    }

    var isInternetGranted =
      await InternetPermission.checkInternetPermissions();

    // Map gender to lowercase string ("female", "male", "other")
    const genderValue =
      gender === 'female' || gender === '2'
        ? 'female'
        : gender === 'other' || gender === '3'
        ? 'other'
        : 'male';

    const formattedDob = moment(new Date(birth_date)).format("YYYY-MM-DD");

    const payload = {
      user_id: user_id ? (isNaN(user_id) ? user_id : Number(user_id)) : user_id,
      fullname: full_name.trim(),
      dob: formattedDob,
      gender: genderValue,
      step: 3,
    };

    if (isInternetGranted == true) {
      nameAddApiCall(payload);
    }
  };

  const nameAddApiCall = (data) => {
    setisLoading(true);
    console.log("[NamePage] addName API Triggered");
    console.log("[NamePage] Endpoint: addName");
    console.log("[NamePage] Full URL:", BASE_URL + "addName");
    console.log("[NamePage] Payload:", data);

    APIWebCall.onNameAddApiCall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[NamePage] addName Response:", response);
        const resBody = response?.data || response;
        const userObj = resBody?.user || response?.user || resBody;

        if (userObj?.step != null) {
          await AsyncStorage.setItem("user_step", userObj.step.toString());
        }
        if (userObj?.fullname) {
          await AsyncStorage.setItem("user_fullname", userObj.fullname.toString());
        }

        if (response?.status === true || response?.data != null) {
          showMessage({
            message: response?.message || "Name added successfully.",
            type: "success",
          });
          navigation.navigate('ProfilePicUpload');
        } else {
          showMessage({
            message: response?.message || "Failed to add name",
            type: 'danger',
          });
        }
      })
      .catch((err) => {
        console.log("[NamePage] addName Error:", err);
        setisLoading(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.response?.data?.error ||
          err?.message ||
          err?.detail ||
          (typeof err === "string" ? err : null) ||
          "Failed to add name";
        showMessage({
          message: errMsg,
          type: 'danger',
        });
      })
      .finally(() => setisLoading(false));
  };

  const nameView = (lable, placeHolder, onChangeText, value, keyboardType) => {
    return (
      <View
        style={{
          flex: 1,
          height: 110,
        }}
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

  const accountView = (
    lable,
    placeHolder,
    onChangeText,
    value,
    keyboardType,
    onPressClick,
    multiline
  ) => {
    return (
      <TouchableOpacity onPress={onPressClick} activeOpacity={activeOpacity}>
        <TextInputView
          placeholder={placeHolder}
          onChangeText={onChangeText}
          secureTextEntry={false}
          value={value}
          text={lable}
          editable={keyboardType === "null" ? false : true}
          keyboardType={keyboardType === "null" ? "default" : keyboardType}
          height={lable === "About" ? 150 : null}
          multiline={multiline}
        />
      </TouchableOpacity>
    );
  };

  const onDateSelected = (event, value) => {
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false);
    }
    setBirthDate(value);

  };

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require('../../assets/bg_3.png')}
    >
      <View style={{ flex: 1 }}>
        <ToolbarBackButton
          btnText={'Name'}
          onBackPress={() => navigation.goBack()}
        />
        <ScrollView style={{ height: '100%', width: '100%' }}>
          <View style={{ marginLeft: 10, marginRight: 10, marginTop: 5 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              {statusView(statusProgressCount, 1, 'Name')}
              {statusView(statusProgressCount, 2, 'Profile Pic')}
              {statusView(statusProgressCount, 3, 'User Type')}
              {statusView(statusProgressCount, 4, 'Social')}
              {statusView(statusProgressCount, 5, 'Category')}
              {statusView(statusProgressCount, 6, 'Media')}
              {statusView(statusProgressCount, 7, 'Keywords')}
              {statusView(statusProgressCount, 8, 'Country')}
            </View>
            {/* <Image
              source={require('../../assets/app_logo_2.png')}
              resizeMode={'contain'}
              style={{
                height: 150,
                width: 150,
                marginBottom: 5,
                alignSelf: 'center',
              }}
            /> */}

            {/* <TextCommonMedium
              text={'Enter your Name'}
              color={COLORS.gry_text}
              fontSize={FONTS_SIZE.txt_16}
              fontWeight={'400'}
              marginLeft={15}
              marginTop={20}
            /> */}

            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              {nameView(
                'Name*',
                'Enter name',
                (newText) => setFullName(newText),
                full_name,
                'default'
              )}
            </View>

            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              {accountView(
                "Birthdate*",
                "Enter birthdate",
                (newText) => setBirthDate(newText),
                birth_date != ""
                  ? moment(birth_date).format("YYYY-MM-DD")
                  : "",
                "null",
                () => {
                  setIsDatePickerVisible(true);
                },
                false
              )}
            </View>

            <View
              style={{
                // width: "100%",
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderColor: COLORS.very_light_grey,
                backgroundColor: COLORS.white_txt,
                marginTop: 30,
                marginHorizontal: 10,
                // elevation: 1
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 45,
                  borderColor:
                    gender === "male" || gender === "1" ? COLORS.primary : COLORS.white_original,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: gender === "male" || gender === "1" ? 0.5 : 0,
                  borderBottomLeftRadius: 5,
                  borderTopLeftRadius: 5,
                }}
                onPress={() => setGender('male')}
              >
                <Text
                  style={{
                    color:
                      gender === "male" || gender === "1" ? COLORS.black_txt : COLORS.gry_text,
                    fontSize: FONTS_SIZE.txt_15,
                    fontFamily: FONTS.FontRegular,
                  }}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 45,
                  borderColor:
                    gender === 'female' || gender === '2'
                      ? COLORS.primary
                      : COLORS.white_original,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: gender === 'female' || gender === '2' ? 0.5 : 0,
                }}
                onPress={() => setGender('female')}
              >
                <Text
                  style={{
                    color:
                      gender === 'female' || gender === '2' ? COLORS.black_txt : COLORS.gry_text,
                    fontSize: FONTS_SIZE.txt_15,
                    fontFamily: FONTS.FontRegular,
                  }}
                >
                  Female
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 45,
                  borderColor:
                    gender === 'other' || gender === '3'
                      ? COLORS.primary
                      : COLORS.white_original,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: gender === 'other' || gender === '3' ? 0.5 : 0,
                  borderBottomRightRadius: 5,
                  borderTopRightRadius: 5,
                }}
                onPress={() => setGender('other')}
              >
                <Text
                  style={{
                    color:
                      gender === 'other' || gender === '3' ? COLORS.black_txt : COLORS.gry_text,
                    fontSize: FONTS_SIZE.txt_15,
                    fontFamily: FONTS.FontRegular,
                  }}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            width: '95%',
            alignSelf: 'center',
          }}
        >
          <ButtonView
            backgroundColor={COLORS.colorGreen}
            btnText={'Next'}
            btntxColor={COLORS.white_txt}
            borderColor={COLORS.colorGreen}
            onPress={() => onNextClick()}
          />
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

        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
  );
}

export default NamePage;
