import { View, Text, Platform, TouchableOpacity, Image } from "react-native";
import React, { useRef } from "react";
import { COLORS, FONTS_SIZE } from "../common/utils";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const HeaderHome = ({
  backgroundColor,
  btnText,
  chiledView,
  onRightClick,
  rightIcon,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.colorPrimaryDark,
        }}
      >
        <View
          style={{
            backgroundColor: backgroundColor,
            flexDirection: "row",
            alignItems: "center",
            paddingTop: Platform.OS === "ios" ? 30 : 35,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 18, height: 18 }}
              resizeMode={"contain"}
              source={require("../assets/humburg.png")}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <TextCommonSemiBlod
              text={btnText}
              color={COLORS.colorBlack}
              fontSize={FONTS_SIZE.txt_16}
              marginRight={rightIcon != undefined ? 0 : 50}
            />
          </View>
          {rightIcon != undefined ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onRightClick()}
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 18, height: 18, tintColor: COLORS.black_txt }}
                resizeMode={"contain"}
                source={rightIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.colorLightGray,
            width: "100%",
          }}
        />
        <View style={{ flex: 1 }}>{chiledView}</View>
      </View>
    </View>
  );
};

export default HeaderHome;
