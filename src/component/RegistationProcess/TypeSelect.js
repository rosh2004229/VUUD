import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ButtonView from '../../common/ButtonView';
import Loader from '../../common/LoadingScreen';
import TextCommonMedium from '../../common/TextCommonMedium';
import TextInputView from '../../common/TextInputView';
import { BASE_URL, COLORS, FONTS_SIZE } from '../../common/utils';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ToolbarBackButton from '../../common/ToolbarBackButton';
import RadioButton from '../../common/RadioButton';
import TextCommonSemiBlod from '../../common/TextCommonSemiBlod';
import InternetPermission from '../../common/InternetPermission';
import AsyncStorage from '@react-native-async-storage/async-storage';
import statusView from '../../common/statusView';
import APIWebCall from '../../common/APIWebCall';
import DialogForcefullyDetails from '../../common/DialogForcefullyDetails';
import { StackActions } from '@react-navigation/native';
let { width, height } = Dimensions.get('window');
let boxCount = 2;
let boxWidth = width / boxCount;

function TypeSelect({ navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [btnName, setBtnName] = useState('Next');
  const [userType, setUserType] = useState(false);
  const [statusProgressCount, setStatusProgressCount] = useState(3);
  const [isModelVisible, setIsModelVisible] = useState(false);

  useEffect(() => {
    if (isInfluencer === false) {
      setBtnName('Done');
    } else {
      setBtnName('Next');
    }
  }, []);

  const onNextClick = async () => {
    if (isInfluencer === true) {
      var user_id = await AsyncStorage.getItem('user_id');
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();
      var data = new FormData();
      data.append('user_id', user_id);
      data.append('user_type', isInfluencer === true ? '2' : '1');
      data.append('step', 3);
      if (isInternetGranted == true) {
        userTypeAddApiCall(data, true);
      }
    } else {
      var isInternetGranted1 =
        await InternetPermission.checkInternetPermissions();
      var user_id = await AsyncStorage.getItem('user_id');
      var data1 = new FormData();
      data1.append('user_id', user_id);
      data1.append('user_type', isInfluencer === true ? '2' : '1');
      data1.append('step', 7);
      if (isInternetGranted1 == true) {
        userTypeAddApiCall(data1, false);
      }
    }
  };

  const userTypeAddApiCall = (data, screen) => {
    setisLoading(true);
    console.log("[TypeSelect] addUsertype API Triggered");
    console.log("[TypeSelect] Endpoint: addUsertype");
    console.log("[TypeSelect] Full URL:", BASE_URL + "addUsertype");
    console.log("[TypeSelect] Payload:", {
      user_type: isInfluencer === true ? "2" : "1",
      step: isInfluencer === true ? 3 : 7,
    });
    APIWebCall.onUserTypeAddApiCall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[TypeSelect] addUsertype Response:", response);
        if (response.data != null || response.data != undefined) {
          if (
            response.data.user_type != null ||
            response.data.user_type != undefined
          ) {
            AsyncStorage.setItem(
              'user_type',
              response?.data?.user_type.toString()
            );
          }

          if (screen === true) {
            navigation.navigate('InstaCountAddPage');
          } else {
            setIsModelVisible(true);
          }
        } else {
          showMessage({
            message: response.message,
            type: 'danger',
          });
        }
      })
      .catch((err) => {
        console.log("[TypeSelect] addUsertype Error:", err);
        setisLoading(false);
        showMessage({
          message: err.message,
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

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require('../../assets/bg_3.png')}
    >
      <View style={{ flex: 1 }}>
        <ToolbarBackButton
          btnText={'User Type'}
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
                height: 180,
                width: 180,
                marginBottom: 5,
                alignSelf: 'center',
              }}
            /> */}

            <TextCommonSemiBlod
              text={'Select User Type'}
              color={COLORS.gry_text}
              fontSize={FONTS_SIZE.txt_16}
              fontWeight={'400'}
              marginLeft={15}
              marginTop={20}
            />

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  marginStart: 10,
                  marginEnd: 10,
                  borderRadius: 5,
                }}
              >
                <RadioButton
                  onPress={() => {
                    setIsInfluencer(false), setBtnName('Register Now');
                  }}
                  visible={!isInfluencer}
                  text={'Normal User'}
                  image={require('../../assets/user_register.png')}
                />
                <RadioButton
                  onPress={() => {
                    setIsInfluencer(true), setBtnName('Next');
                  }}
                  visible={isInfluencer}
                  text={'Influencer'}
                  image={require('../../assets/influencer.png')}
                />
              </View>
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
            btnText={btnName}
            btntxColor={COLORS.white_txt}
            borderColor={COLORS.colorGreen}
            onPress={() => onNextClick()}
          />
        </View>
        <Loader loading={isLoading} />
      </View>

      <DialogForcefullyDetails
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
            // navigation.dispatch(StackActions.replace('Drawer_Menu'));
            navigation.reset({
              index: 0,
              routes: [{ name: 'Drawer_Menu' }],
            });
          }, 120);
        }}
      />
    </ImageBackground>
  );
}

export default TypeSelect;
