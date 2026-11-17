import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import {
  COLORS,
  FONTS_SIZE,
  IMG_BASE_URL,
  activeOpacity,
  elevation,
} from "../common/utils";
import ToolbarBackButton from "../common/ToolbarBackButton";
import TextInputView from "../common/TextInputView";
import TextCommonMedium from "../common/TextCommonMedium";
import ButtonView from "../common/ButtonView";
import TextCommonregular from "../common/TextCommonregular";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyRequestDetailPage = ({ route, navigation }) => {
  const { item } = route.params;

  const [full_name, setFullName] = useState("");
  const [about, setAbout] = useState("");

  AsyncStorage.setItem("isBackScreen", "true");

  const commonContactUsView = (lable, txt) => {
    return (
      <View
        style={{
          // flexDirection: 'row',
          // alignItems: 'center',
          padding: 15,
          marginTop: 15,
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: elevation,
          backgroundColor: COLORS.white_txt,
          borderRadius: 10,
        }}
      >
        <TextCommonSemiBlod
          text={lable}
          color={COLORS.black_txt}
          fontSize={FONTS_SIZE.txt_15}
          fontWeight={"400"}
          numberOfLines={2}
        />
        <TextCommonregular
          text={txt}
          color={COLORS.gry_light}
          fontSize={FONTS_SIZE.txt_14}
          fontWeight={"200"}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <ToolbarBackButton
        btnText={"My Request Details"}
        onBackPress={() => navigation.goBack(null)}
      />
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "white",
            justifyContent: "center",
            alignSelf: "center",
            height: 100,
            width: 100,
            borderRadius: 100 / 2,
            borderWidth: 1.5,
            borderColor: COLORS.light_pink,
          }}
          activeOpacity={activeOpacity}
          onPress={() => {
            //   setIsImageSelectClick(true);
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: 90,
              width: 90,
              borderRadius: 90 / 2,
            }}
            activeOpacity={activeOpacity}
            onPress={() => {
              // setIsImageSelectClick(true);
            }}
          >
            <FastImage
              style={{
                height: 90,
                width: 90,
                borderRadius: 90 / 2,
              }}
              source={
                item != null &&
                item != undefined &&
                item.user != undefined &&
                item.user != null &&
                item.user.image != null &&
                item.user.image != undefined
                  ? {
                      uri: IMG_BASE_URL + item.user.image,
                      priority: FastImage.priority.high,
                    }
                  : require("../assets/user_pro.png")
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {item != null &&
        item != undefined &&
        item.user != undefined &&
        item.user != null ? (
          <View style={{ marginLeft: 25, marginRight: 25, marginTop: 10 }}>
            {commonContactUsView("Full Name", item.user.fullname)}
            {commonContactUsView("Date", item.date)}
            {commonContactUsView("Purpose", item.description)}
            {commonContactUsView("City", item.city)}

            <View
              style={{
                marginTop: 50,
              }}
            >
              {/* <ButtonView
               backgroundColor={COLORS.colorGreen}
               btnText={"Approve"}
               btntxColor={COLORS.white_txt}
               borderColor={COLORS.colorGreen}
               // onPress={() => onLoginClick()}
               onPress={() => navigation.goBack(null)}
             /> */}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default MyRequestDetailPage;
