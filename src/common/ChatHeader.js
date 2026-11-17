import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import TextCommonSemiBlod from "./TextCommonSemiBlod";
import { COLORS, FONTS_SIZE, activeOpacity } from "./utils";

function ChatHeader({ btnText, onBackPress, onRightClick, rightIcon }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 54,
        width: "100%",
        backgroundColor: COLORS.white_txt,
        borderBottomWidth: 0.5,
        borderBottomColor: "#EEEEEE",
        paddingHorizontal: 8,
      }}
    >
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onBackPress}
        style={{
          width: 35,
          height: 35,
          borderRadius: 35 / 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 16, height: 16, tintColor: COLORS.black_txt }}
          resizeMode={"contain"}
          source={require("../assets/back.png")}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onRightClick}
        style={{
          width: 38,
          height: 38,
          borderRadius: 38 / 2,
          marginHorizontal: 10,
          backgroundColor: COLORS.white_txt,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={rightIcon}
          resizeMode={"cover"}
          style={{
            height: 38,
            width: 38,
            borderRadius: 38 / 2,
          }}
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <TextCommonSemiBlod
          text={btnText}
          color={COLORS.black_txt}
          fontSize={FONTS_SIZE.txt_16}
          numberOfLines={1}
        />
      </View>
    </View>
  );
}

export default ChatHeader;
