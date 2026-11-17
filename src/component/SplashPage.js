import React, { useState, useEffect } from "react";
import { View, Image, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, analyticsLog } from "../common/utils";
import InternetPermission from "../common/InternetPermission";
import { StackActions } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';
import Header from "../common/Header";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonView from "../common/ButtonView";
import RNFS from 'react-native-fs';

function SplashPage({ navigation }) {
  useEffect(() => {
    clearTemporaryFiles();
    getData();
  }, []);

  const getData = async () => {
    analyticsLog("Splash_screen");
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted === true) {
      var is_confirm = await AsyncStorage.getItem("is_confirm");
      if (is_confirm === "true") {
        var user_id = await AsyncStorage.getItem("user_id");
        setTimeout(() => {
          if (user_id !== null) {
            navigation.dispatch(StackActions.replace("Drawer_Menu"));
          } else {
            navigation.dispatch(StackActions.replace("OnBoardingPage"));
          }
        }, 1000);
      } else {

        setTimeout(() => {
          navigation.dispatch(StackActions.replace("OnBoardingPage"));
        }, 1000);
      }
    }
  };
  const clearTemporaryFiles = async () => {
    try {
      const tempDirPath = RNFS.TemporaryDirectoryPath; // Get the temp directory path
      const files = await RNFS.readDir(tempDirPath); // List all files in the temp directory
      for (const file of files) {
        await RNFS.unlink(file.path); // Delete each file
      }
      console.log('Temporary files cleared');
    } catch (error) {
      console.error('Error clearing temporary files:', error);
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Image
          style={{ height: 280, width: 280 }}
          source={require("../assets/app_logo.png")}
          resizeMode={"contain"}
        /> */}

        <Animatable.Image
          animation="fadeInDownBig"
          style={{ height: 300, width: wp(85) }}
          resizeMode={'contain'}
          source={require("../assets/app_logo.png")}
        />
      </View>
      {/* <View style={{ marginHorizontal: 20, marginBottom: 25, }}>
        <ButtonView
          backgroundColor={COLORS.colorGreen}
          btnText={'Sign up'}
          btntxColor={COLORS.white_txt}
          borderColor={COLORS.colorGreen}
          //onPress={() => onLoginClick()}
          onPress={() => navigation.navigate("SignUp")}
        />
        <View style={{ marginTop: 15 }}>
          <ButtonView
            backgroundColor={COLORS.colorGreen}
            btnText={'Login'}
            btntxColor={COLORS.white_txt}
            borderColor={COLORS.colorGreen}
            //onPress={() => onLoginClick()}
            onPress={() => navigation.navigate("LoginPage")}
          />
        </View>
      </View> */}


    </ImageBackground>
  );
}

export default SplashPage;
