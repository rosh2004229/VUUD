import React, { useState, useEffect } from "react";
import { View, Image, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, analyticsLog } from "../common/utils";
import InternetPermission from "../common/InternetPermission";
import { StackActions } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import Header from "../common/Header";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonView from "../common/ButtonView";

function OnBoardingPage({ navigation }) {
  // useEffect(() => {
  //     getData();
  // }, []);

  // const getData = async () => {
  //     analyticsLog("Splash_screen");
  //     var isInternetGranted = await InternetPermission.checkInternetPermissions();
  //     if (isInternetGranted === true) {
  //         var is_confirm = await AsyncStorage.getItem("is_confirm");
  //         if (is_confirm === "true") {
  //             var user_id = await AsyncStorage.getItem("user_id");
  //             // setTimeout(() => {
  //             //   if (user_id !== null) {
  //             //     navigation.dispatch(StackActions.replace("Drawer_Menu"));
  //             //   } else {
  //             //     navigation.dispatch(StackActions.replace("LoginPage"));
  //             //   }
  //             // }, 1000);
  //         } else {

  //             // setTimeout(() => {
  //             //   navigation.dispatch(StackActions.replace("LoginPage"));
  //             // }, 1000);
  //         }
  //     }
  // };

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require("../assets/influencer_onBording_2.jpg")}
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
      </View>

      <View
        style={{
          marginBottom: 60,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
          marginHorizontal: 10,
        }}
      >
        <View style={{ width: wp(48) }}>
          <ButtonView
            backgroundColor={COLORS.colorGreen}
            btnText={"Register"}
            btntxColor={COLORS.white_txt}
            borderColor={COLORS.colorGreen}
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
        <View style={{ width: wp(48) }}>
          <ButtonView
            backgroundColor={COLORS.colorGreen}
            btnText={"Login"}
            btntxColor={COLORS.white_txt}
            borderColor={COLORS.colorGreen}
            onPress={() => navigation.navigate("LoginPage")}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

export default OnBoardingPage;
