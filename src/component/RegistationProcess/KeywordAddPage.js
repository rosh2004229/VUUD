import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
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
  generateUUID,
} from '../../common/utils';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TextCommonregular from '../../common/TextCommonregular';
import ToolbarBackButton from '../../common/ToolbarBackButton';
import statusView from '../../common/statusView';
import InternetPermission from '../../common/InternetPermission';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import APIWebCall from '../../common/APIWebCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialogForcefullyDetails from '../../common/DialogForcefullyDetails';
let { width, height } = Dimensions.get('window');
var _ = require('lodash');

let boxCount = 2;
let boxWidth = width / boxCount;

function KeywordAddPage({ navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [statusProgressCount, setStatusProgressCount] = useState(7);
  const [selectedHashValuesArr, setSelectedHashValueArr] = useState([]);
  const [hashTagText, setHashTagText] = useState('');
  const [dataList, setDataList] = useState([]);
  const [isModelVisible, setIsModelVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDataList([]);
      setSelectedHashValueArr([]);
      getHashKeyword();
    }, [])
  );

  const getHashKeyword = async () => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var data = new FormData();
      data.append('filter', '');
      data.append('category_id', '');
      onGeHashListAPICall(data);
    }
  };

  const onGeHashListAPICall = async (data) => {
    setisLoading(true);
    APIWebCall.onGeHashListAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        var keyword_Ayy = [];
        if (
          response.data.Hashtag.length > 0 &&
          response.data.Hashtag != undefined &&
          response.data.Hashtag != null
        ) {
          if (response.data.Hashtag.length > 0) {
            response.data.Hashtag.forEach((element, index) => {
              var obj = {
                name: element.hashtag,
                isSelected: false,
                id: element.id,
              };
              keyword_Ayy.push(obj);
            });
          }
          setDataList(keyword_Ayy);
        }
      })
      .catch((err) => {
        console.log("[KeywordAddPage] addMultiplehastags Error:", err);
        setisLoading(false);
        setTimeout(() => {
          SnackBarCommon({ text: err.message });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const onNextClick = async () => {
    Keyboard.dismiss();
    if (selectedHashValuesArr.length === 0) {
      showMessage({
        message: 'Select at least one keyword',
        type: 'danger',
      });
    } else {
      var user_id = await AsyncStorage.getItem('user_id');
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();
      var data = new FormData();
      if (selectedHashValuesArr.length > 0) {
        selectedHashValuesArr.forEach((element) => {
          data.append('regihashtag[]', element.name);
        });
      } else {
        data.append('regihashtag[]', null);
      }
      data.append('user_id', user_id);
      data.append('step', 7);

      if (isInternetGranted == true) {
        hashKeywordAddApiCall(data);
      }
    }
  };

  const hashKeywordAddApiCall = (data) => {
    setisLoading(true);
    console.log("[KeywordAddPage] addMultiplehastags API Triggered");
    console.log("[KeywordAddPage] Endpoint: addMultiplehastags");
    console.log("[KeywordAddPage] Full URL:", BASE_URL + "addMultiplehastags");
    console.log("[KeywordAddPage] Payload:", {
      selectedKeywords: selectedHashValuesArr,
      step: 7,
    });
    APIWebCall.onHashKeywordAddApiCall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[KeywordAddPage] addMultiplehastags Response:", response);
        // if (response.data != null || response.data != undefined) {
        //   setIsModelVisible(true);
        // } else {
        //   showMessage({
        //     message: response.message,
        //     type: 'danger',
        //   });
        // }
        if (response.data != null || response.data != undefined) {
          navigation.navigate('CityAndCountryAddPage');
        } else {
          showMessage({
            message: response.message,
            type: 'danger',
          });
        }
      })
      .catch((err) => {
        console.log("[KeywordAddPage] addMultiplehastags Error:", err);
        setisLoading(false);
        showMessage({
          message: err.message,
          type: 'danger',
        });
      })
      .finally(() => setisLoading(false));
  };

  // const onAddHashClick = () => {
  //   Keyboard.dismiss();
  //   var hashTagAdd = [];
  //   if (selectedHashValuesArr.length < 15) {
  //     if (hashTagText != '') {
  //       var obj = {
  //         hashtag_name: hashTagText,
  //         id: generateUUID(1),
  //       };
  //       hashTagAdd.push(obj);
  //     } else {
  //       showMessage({
  //         message: 'Enter keyword',
  //         type: 'danger',
  //       });
  //     }
  //   } else {
  //     showMessage({
  //       message: 'Maximum fifteen keyword added.',
  //       type: 'danger',
  //     });
  //   }
  //   if (hashTagAdd.length > 0) {
  //     const output = mergeArrays(selectedHashValuesArr, hashTagAdd);
  //     setSelectedHashValueArr(output);
  //     setHashTagText('');
  //   }
  // };

  // const onRemoveItemClick = (selectedValue) => {
  //   const output = selectedHashValuesArr.filter(
  //     (item) => item.hashtag_name !== selectedValue
  //   );
  //   setSelectedHashValueArr(output);
  // };

  // const mergeArrays = (arr1, arr2) => {
  //   const mergedArray = [
  //     ...arr2,
  //     ...arr1.filter(
  //       (item1) =>
  //         !arr2.some((item2) => item2.hashtag_name === item1.hashtag_name)
  //     ),
  //   ];

  //   return mergedArray;
  // };

  const updateArray = (originalArray, updateArray) => {
    return originalArray.map((item) => {
      const updateItem = updateArray.find((update) => update.id === item.id);
      return updateItem ? updateItem : item;
    });
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

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require('../../assets/bg_3.png')}
    >
      <View style={{ flex: 1 }}>
        <ToolbarBackButton
          btnText={'Keywords'}
          onBackPress={() => navigation.goBack()}
        />
        <View
          style={{ marginLeft: 10, marginRight: 10, marginTop: 5, flex: 1 }}
        >
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

          <View
            style={{
              marginTop: 10,
              marginStart: 10,
              marginEnd: 10,
              flex: 1,
            }}
          >
            <FlatList
              style={{
                flex: 1,
              }}
              keyboardShouldPersistTaps={'always'}
              data={dataList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={() => {
                      if (selectedHashValuesArr.length < 15) {
                        var temp = [...dataList];
                        temp[index].isSelected = !temp[index].isSelected;
                        setDataList(temp);

                        const selected_Category_ayy = _.filter(
                          temp,
                          (item) => item.isSelected === true
                        );
                        setSelectedHashValueArr(selected_Category_ayy);
                      } else {
                        showMessage({
                          message: 'Maximum fifteen keyword added.',
                          type: 'danger',
                        });
                      }
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      backgroundColor:
                        item.isSelected === true
                          ? COLORS.very_light_orange
                          : COLORS.white_original,
                      borderRadius: 30,
                      borderWidth: 0.4,
                      marginHorizontal: 5,
                      borderColor: COLORS.gry_text,
                    }}
                  >
                    <TextCommonregular
                      text={item.name}
                      color={COLORS.black_txt}
                      fontSize={FONTS_SIZE.txt_11}
                      fontWeight={'400'}
                    />
                  </TouchableOpacity>
                );
              }}
              // ListEmptyComponent={() => {
              //   return isLoading === false ? (
              //     <ListEmptyView txt={'No data found'} />
              //   ) : null;
              // }}
              keyExtractor={(_, index) => index.toString()}
            />

            {/* <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    marginTop: 10,
                  }}
                >
                  {selectedHashValuesArr.length > 0
                    ? selectedHashValuesArr.map((item, index) => {
                      return (
                        <View
                          // onPress={() => setHashTagText(item.hashtag_name)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                            paddingHorizontal: 10,
                            marginHorizontal: index >= 1 ? 10 : 0,
                            paddingVertical: 5,
                            backgroundColor: COLORS.very_light_grey,
                            borderRadius: 30,
                            borderWidth: 0.4,
                            borderColor: COLORS.gry_text,
                          }}
                        >
                          <TextCommonregular
                            text={item.hashtag_name}
                            color={COLORS.black_txt}
                            fontSize={FONTS_SIZE.txt_11}
                            fontWeight={'400'}
                          />

                          <TouchableOpacity
                            style={{
                              padding: 7,
                              backgroundColor: COLORS.refecode_backcolor,
                              borderRadius: 50 / 2,
                              marginLeft: 8,
                            }}
                            onPress={() =>
                              onRemoveItemClick(item.hashtag_name)
                            }
                          >
                            <Image
                              style={{
                                width: 8,
                                height: 8,
                                tintColor: COLORS.color_red,
                              }}
                              source={require('../../assets/close_icon.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })
                    : null}
                </View>
              </ScrollView> */}
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '95%',
            alignSelf: 'center',
            backgroundColor: COLORS.card_bg,
            paddingBottom: 40,
            // height: 70,
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

      {/* <DialogForcefullyDetails
        loading={isModelVisible}
        iconColor={COLORS.primary}
        msg_text={'You have logged in successfully'}
        msg_title={'Login Account'}
        rightButtonText={'Ok'}
        onPressRightButton={() => {
          setIsModelVisible(false);
          AsyncStorage.removeItem('selected_category_ayy');
          AsyncStorage.setItem('is_confirm', 'true');
          setTimeout(() => {
            navigation.dispatch(StackActions.replace('Drawer_Menu'));
          }, 120);
        }}
      /> */}
    </ImageBackground>
  );
}

export default KeywordAddPage;
