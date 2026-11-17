import React from "react";
import { TouchableOpacity, Image } from "react-native";
import TextCommonSemiBlod from "./TextCommonSemiBlod";
import { COLORS, FONTS_SIZE } from "./utils";
import LinearGradient from "react-native-linear-gradient";

function ButtonView({
  backgroundColor,
  btnText,
  btntxColor,
  borderColor,
  onPress,
  height,
  visible,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        // backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderRadius: 10,
        height: height != undefined || height != null ? height : 50,
        borderWidth: 0,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <LinearGradient
        colors={["#ef4b53", "#eb297b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 10,
          height: height != undefined || height != null ? height : 50,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {visible === true ? (
          <Image
            source={
              btnText === "SEARCH"
                ? require("../assets/search_icon.png")
                : require("../assets/filter.png")
            }
            resizeMode={"contain"}
            style={{
              tintColor:
                btnText === "SEARCH"
                  ? COLORS.white_txt
                  : COLORS.color_toolbar_btn_BG,
              height: btnText === "SEARCH" ? 22 : 24,
              width: btnText === "SEARCH" ? 22 : 24,
              marginRight: 5,
            }}
          />
        ) : null}

        <TextCommonSemiBlod
          text={btnText}
          color={btntxColor}
          fontSize={FONTS_SIZE.txt_16}
          textAlign={"center"}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default ButtonView;
