import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import React, { useState, createContext } from 'react';
import { Image, Platform, View, Dimensions, AppState } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS_SIZE } from './common/utils';
// import screen
import SplashPage from './component/SplashPage';
// Auth Screen
import EditProfilePage from './component/EditProfile';
import InfluencerListPage from './component/InfluencerListPage';
import InfluencerProfilePage from './component/InfluencerProfilePage';
import OnBoardingPage from './component/OnBoardingPage';
import LoginPage from './component/LoginPage';
import ForgotPasswordPage from './component/ForgotPasswordPage';
import SignUp from './component/SignUp';
import OtpPage from './component/OtpPage';
import RegisterPage from './component/RegisterPage';
import TestingPage from './component/TestingPage';
import SettingPage from './component/SettingPage';
import PACPage from './component/PACPage';
import FilterPage from './component/FilterPage';
import SelectDataPage from './component/SelectDataPage';
import SearchInfluencerPage from './component/SearchInfluencerPage';
import ImageDetailPage from './component/ImageDetailPage';
import NotificationPage from './component/NotificationPage';
import NotificationDetailsAdd from './component/NotificationDetailsAdd';
import ChatScreen from './component/ChatScreen';
import UserProfilePage from './component/UserProfilePage';
import UserEditProfilePage from './component/UserEditProfilePage';
import FilterByCategorySearch from './component/FilterByCategorySearch';
import MyRequestPage from './component/MyRequestPage';
import RequestsPage from './component/RequestsPage';
import ExplorePage from './component/ExplorePage';
import SelectCategoryPage from './component/SelectCategoryPage';
import SelectCityPage from './component/SelectCityPage';
import SelectKeywordPage from './component/SelectKeywordPage';
import SelectCountryPage from './component/SelectCountryPage';

// drawer menu
import CustomSidebarMenu from './common/CustomSidebarMenu';
import SearchHashTagListPage from './component/SearchHashTagListPage';
import MessageUsersListPage from './component/MessageUsersListPage';
import TextCommonregular from './common/TextCommonregular';
import { useFocusEffect } from '@react-navigation/native';
import APIWebCall from './common/APIWebCall';
import NamePage from './component/RegistationProcess/NamePage';
import TypeSelect from './component/RegistationProcess/TypeSelect';
import ProfilePicUpload from './component/RegistationProcess/ProfilePicUpload';
import InstaCountAddPage from './component/RegistationProcess/InstaCountAddPage';
import CategotySelectRegisterPage from './component/RegistationProcess/CategorySelectRegisterPage';
import CategorySelectRegisterPage from './component/RegistationProcess/CategorySelectRegisterPage';
import AllMediaPicUploadPage from './component/RegistationProcess/AllMediaPicUploadPage';
import KeywordAddPage from './component/RegistationProcess/KeywordAddPage';
import RequestSendSuccessful from './component/RequestSendSuccessful';
import CityAndCountryAddPage from './component/RegistationProcess/CityAndCountryAddPage';
import MyRequestDetailPage from './component/MyRequestDetailPage';
import TextCommonSemiBlod from './common/TextCommonSemiBlod';
import { useRef } from 'react';

import useAsyncStorageCommon from '../src/common/AsyncStorageCommon';
import SubscriptionsPage from './component/SubscriptionsPage';

const Stack_Auth = createStackNavigator();

const Tab = createBottomTabNavigator();
const Drawer_stack = createDrawerNavigator();

const navigatorOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};
function AuthNavigator() {
  return (
    <Stack_Auth.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashPage"
      backBehavior="history"

    >
      <Stack_Auth.Screen name="SplashPage" component={SplashPage} />
      <Stack_Auth.Screen name="OnBoardingPage" component={OnBoardingPage} />
      <Stack_Auth.Screen name="LoginPage" component={LoginPage} />
      <Stack_Auth.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} />
      <Stack_Auth.Screen name="SignUp" component={SignUp} />
      <Stack_Auth.Screen name="OtpPage" component={OtpPage} />
      <Stack_Auth.Screen name="RegisterPage" component={RegisterPage} />
      <Stack_Auth.Screen name="Drawer_Menu" component={Drawer_Menu} />
      <Stack_Auth.Screen name="PACPage" component={PACPage} />

      <Stack_Auth.Screen name="EditProfilePage" component={EditProfilePage} />

      <Stack_Auth.Screen name="SelectCityPage" component={SelectCityPage} />
      <Stack_Auth.Screen name="SelectCountryPage" component={SelectCountryPage} />
      <Stack_Auth.Screen name="SelectKeywordPage" component={SelectKeywordPage} />
      <Stack_Auth.Screen name="SelectCategoryPage" component={SelectCategoryPage} />

      <Stack_Auth.Screen name="NamePage" component={NamePage} />
      <Stack_Auth.Screen name="ProfilePicUpload" component={ProfilePicUpload} />
      <Stack_Auth.Screen name="TypeSelect" component={TypeSelect} />
      <Stack_Auth.Screen name="CityAndCountryAddPage" component={CityAndCountryAddPage} />
      <Stack_Auth.Screen name="InstaCountAddPage" component={InstaCountAddPage} />
      <Stack_Auth.Screen name="CategorySelectRegisterPage" component={CategorySelectRegisterPage} />
      <Stack_Auth.Screen name="AllMediaPicUploadPage" component={AllMediaPicUploadPage} />
      <Stack_Auth.Screen name="KeywordAddPage" component={KeywordAddPage} />
    </Stack_Auth.Navigator>
  );
}

function Drawer_Menu() {
  return (
    <Drawer_stack.Navigator
      initialRouteName="AllTabs"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: Dimensions.get('window').width / 1.2 },
        drawerType: 'front',
        swipeEnabled: false,
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer_stack.Screen name="AllTabs" component={AllTabs} />
      <Drawer_stack.Screen name="TestingPage" component={TestingPage} />

      <Drawer_stack.Screen name="InfluencerProfilePage" component={InfluencerProfilePage} />
      <Drawer_stack.Screen name="FilterPage" component={FilterPage} />
      <Drawer_stack.Screen name="SelectDataPage" component={SelectDataPage} />
      <Drawer_stack.Screen name="SearchInfluencerPage" component={SearchInfluencerPage} />

      <Drawer_stack.Screen name="ImageDetailPage" component={ImageDetailPage} />
      <Drawer_stack.Screen name="NotificationDetailsAdd" component={NotificationDetailsAdd} />
      <Drawer_stack.Screen name="ChatScreen" component={ChatScreen} />
      <Drawer_stack.Screen name="UserEditProfilePage" component={UserEditProfilePage} />
      <Drawer_stack.Screen name="FilterByCategorySearch" component={FilterByCategorySearch} />
      <Drawer_stack.Screen name="MyRequestPage" component={MyRequestPage} />
      <Drawer_stack.Screen name="MyRequestDetailPage" component={MyRequestDetailPage} />
      <Drawer_stack.Screen name="RequestsPage" component={RequestsPage} />
      <Drawer_stack.Screen name="RequestSendSuccessful" component={RequestSendSuccessful} />
      <Drawer_stack.Screen name="InfluencerListPage" component={InfluencerListPage} />
      <Drawer_stack.Screen name="SettingPage" component={SettingPage} />
      <Drawer_stack.Screen name="SubscriptionsPage" component={SubscriptionsPage} />
    </Drawer_stack.Navigator>
  );
}

function AllTabs() {
  const insets = useSafeAreaInsets();
  const {
    item: itemNotiCount,
    setItem: setNotiCount,
    removeItem: removeNotiCount,
  } = useAsyncStorageCommon('noti_count');

  // Ensure bottom navigation bar / gesture bar never covers the tab bar
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 10 : 0);
  const tabHeight = 60 + bottomInset;

  const roundView = (focused, icon, color) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 6,
        }}
      >
        <Image
          style={{
            width: 22,
            height: 22,
            tintColor: focused === true ? COLORS.primary : color,
            resizeMode: 'contain',
          }}
          source={icon}
        />
        <View
          style={{
            width: 5,
            height: 5,
            marginTop: 4,
            backgroundColor: focused === true ? COLORS.primary : 'transparent',
            borderRadius: 5,
          }}
        />
      </View>
    );
  };

  const roundViewCountView = (focused, icon, color, count) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 6,
        }}
      >
        {count > 0 ? (
          <View
            style={{
              minWidth: 18,
              height: 18,
              paddingHorizontal: 4,
              backgroundColor: focused === true ? COLORS.primary : color,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 9,
              position: 'absolute',
              top: 0,
              right: -10,
              zIndex: 10,
            }}
          >
            <TextCommonSemiBlod
              text={count}
              color={COLORS.white_txt}
              fontSize={FONTS_SIZE.txt_10}
              fontWeight={'600'}
            />
          </View>
        ) : null}

        <Image
          style={{
            width: 22,
            height: 22,
            tintColor: focused === true ? COLORS.primary : color,
            resizeMode: 'contain',
          }}
          source={icon}
        />
        <View
          style={{
            width: 5,
            height: 5,
            marginTop: 4,
            backgroundColor: focused === true ? COLORS.primary : 'transparent',
            borderRadius: 5,
          }}
        />
      </View>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: tabHeight,
          paddingBottom: bottomInset > 0 ? bottomInset : 4,
          paddingTop: 4,
          backgroundColor: COLORS.white_txt,
          borderTopWidth: 0.5,
          borderTopColor: '#EEEEEE',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomePage"
        component={ExplorePage}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) =>
            roundView(focused, require('./assets/home_icon.png'), color),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchInfluencerPage}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) =>
            roundView(focused, require('./assets/search_icon.png'), color),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationPage}
        initialParams={{ HeaderVisible: false }}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) =>
            roundViewCountView(
              focused,
              require('./assets/notification.png'),
              color,
              itemNotiCount
            ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageUsersListPage}
        initialParams={{ HeaderVisible: false }}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) =>
            roundView(focused, require('./assets/message_icon.png'), color),
        }}
      />
      <Tab.Screen
        name="UserProfilePage"
        component={UserProfilePage}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) =>
            roundView(focused, require('./assets/user.png'), color),
        }}
      />
    </Tab.Navigator>
  );
}

export default AuthNavigator;
