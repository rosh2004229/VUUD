import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ButtonView from '../../common/ButtonView';
import Loader from '../../common/LoadingScreen';
import TextCommonMedium from '../../common/TextCommonMedium';
import TextInputView from '../../common/TextInputView';
import {
  BASE_URL,
  COLORS,
  FONTS_SIZE,
  activeOpacity,
  elevation,
} from '../../common/utils';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ToolbarBackButton from '../../common/ToolbarBackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import statusView from '../../common/statusView';
import InternetPermission from '../../common/InternetPermission';
import APIWebCall from '../../common/APIWebCall';
import SnackBarCommon from '../../common/SnackBarCommon';
let { width, height } = Dimensions.get('window');
var _ = require('lodash');

let boxCount = 2;
let boxWidth = width / boxCount;

function CategorySelectRegisterPage({ route, navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [statusProgressCount, setStatusProgressCount] = useState(5);
  const [selectedValuesArr, setSelectedValueArr] = useState([]);
  const [dataList, setDataList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setSelectedValueArr([]);
      setDataList([]);
      getSelectedCategory();
    }, [])
  );

  const getSelectedCategory = async () => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      onInfluencerCategoryListAPICall();
    }
  };

  const onInfluencerCategoryListAPICall = async () => {
    setisLoading(true);
    console.log("[CategorySelectRegisterPage] Fetching categories from getCaterory...");
    APIWebCall.onInfluencerCategoryListAPICall()
      .then(async (response) => {
        setisLoading(false);
        console.log("[CategorySelectRegisterPage] getCaterory Response:", response);
        var category_Ayy = [];
        const categories =
          response?.data?.category ||
          response?.category ||
          (Array.isArray(response?.data) ? response?.data : null) ||
          [];

        if (Array.isArray(categories) && categories.length > 0) {
          categories.forEach((element) => {
            const catName = element?.name || element?.category_name || "";
            var obj = {
              name: catName,
              category_name: catName,
              isSelected: false,
              id: element?.id,
              ...element,
            };
            category_Ayy.push(obj);
          });
          setDataList(category_Ayy);
        } else {
          setDataList([]);
        }
      })
      .catch((err) => {
        console.log("[CategorySelectRegisterPage] getCaterory Error:", err);
        setisLoading(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load categories";
        setTimeout(() => {
          SnackBarCommon({ text: errMsg });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const onNextClick = async () => {
    Keyboard.dismiss();
    if (selectedValuesArr.length === 0) {
      showMessage({
        message: 'Select category',
        type: 'danger',
      });
      return;
    }

    var isInternetGranted =
      await InternetPermission.checkInternetPermissions();
    if (!isInternetGranted) return;

    var storedUserId = await AsyncStorage.getItem('user_id');
    var rawUserId = route?.params?.user_id || storedUserId;
    var parsedUserId = Number(rawUserId);
    if (isNaN(parsedUserId)) {
      parsedUserId = rawUserId;
    }

    var categoryIds = selectedValuesArr.map((item) => {
      const num = Number(item.id);
      return !isNaN(num) ? num : item.id;
    });

    var payload = {
      user_id: parsedUserId,
      category_id: categoryIds,
      step: 7,
    };

    categoryAddApiCall(payload);
  };

  const categoryAddApiCall = (payload) => {
    setisLoading(true);
    console.log("\n==================== [addMultiplecategory API REQUEST] ====================");
    console.log("Endpoint: addMultiplecategory");
    console.log("Full URL:", BASE_URL + "addMultiplecategory");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("===========================================================================\n");

    APIWebCall.onCategoryAddApiCall(payload)
      .then(async (response) => {
        setisLoading(false);
        console.log("\n==================== [addMultiplecategory API RESPONSE] ====================");
        console.log("Response:", response);
        console.log("============================================================================\n");

        const resData = response?.data || response;
        if (response?.status === true || resData != null) {
          const userObj = resData?.user || response?.user || resData;
          if (userObj?.step != null) {
            await AsyncStorage.setItem("user_step", userObj.step.toString());
          }
          await AsyncStorage.removeItem('selected_category_ayy');
          showMessage({
            message: response?.message || "Categories added successfully.",
            type: "success",
          });
          navigation.navigate('AllMediaPicUploadPage');
        } else {
          showMessage({
            message: response?.message || "Failed to add categories",
            type: 'danger',
          });
        }
      })
      .catch((err) => {
        console.log("[CategorySelectRegisterPage] addMultiplecategory Error:", err);
        setisLoading(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to add categories";
        showMessage({
          message: errMsg,
          type: 'danger',
        });
      })
      .finally(() => setisLoading(false));
  };

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require('../../assets/bg_3.png')}
    >
      <View style={{ flex: 1 }}>
        <ToolbarBackButton
          btnText={'Select Favorite Category'}
          onBackPress={() => navigation.goBack()}
        />
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
        </View>
        <FlatList
          style={{ flex: 1 }}
          keyboardShouldPersistTaps={'always'}
          data={dataList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            alignItems: 'center',
          }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                style={{
                  backgroundColor: COLORS.white_txt,
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  width: '93%',
                  marginVertical: 5,
                  shadowColor: COLORS.shadow_color,
                  shadowOffset: { width: -2, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  elevation: elevation,
                  marginLeft: 10,
                  marginRight: 10,
                }}
                onPress={() => {
                  var temp = [...dataList];
                  temp[index].isSelected = !temp[index].isSelected;
                  setDataList(temp);

                  const selected_Category_ayy = _.filter(
                    temp,
                    (item) => item.isSelected === true
                  );
                  setSelectedValueArr(selected_Category_ayy);
                }}
              >
                <View
                  style={{
                    width: '98%',
                    flexDirection: 'row',
                    height: 35,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <TextCommonMedium
                      text={item.name}
                      color={COLORS.black_txt}
                      fontSize={FONTS_SIZE.txt_14}
                      fontWeight={'600'}
                      textAlign={'left'}
                    />
                  </View>
                  {item.isSelected ? (
                    <Image
                      source={require('../../assets/right_icon.png')}
                      resizeMode={'contain'}
                      style={{
                        tintColor: COLORS.colorGreen,
                        height: 24,
                        width: 24,
                      }}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
          //   ListEmptyComponent={() => {
          //     return isLoading === false ? (
          //       <ListEmptyView txt={'No data found'} />
          //     ) : null;
          //   }}
          keyExtractor={(_, index) => index.toString()}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '95%',
            alignSelf: 'center',
            paddingBottom: 40,
            // paddingTop: 10,
            backgroundColor: COLORS.card_bg
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
        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
  );
}

export default CategorySelectRegisterPage;
