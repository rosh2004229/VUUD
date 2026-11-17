import React from "react";
import {
  Image,
  Platform,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS_SIZE } from "./utils";
import TextCommonSemiBlod from "./TextCommonSemiBlod";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function Header({
  onFilterClick,
  filter,
  backIcon,
  onBackClick,
  btnText,
  rightIconVisible,
}) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0);

  return (
    <View
      style={{
        backgroundColor: COLORS.white_txt,
        paddingTop: topInset,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: "#EEEEEE",
      }}
    >
      <View
        style={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 35,
            height: 35,
            borderRadius: 35 / 2,
          }}
          activeOpacity={0.8}
          onPress={onBackClick}
        >
          <Image
            style={{ width: 28, height: 28, tintColor: COLORS.black_txt }}
            resizeMode={"cover"}
            source={backIcon}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextCommonSemiBlod
            text={btnText}
            color={COLORS.black_txt}
            fontSize={FONTS_SIZE.txt_18}
            textAlign={"center"}
          />
        </View>
        {rightIconVisible === true ? (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
            }}
            activeOpacity={0.8}
            onPress={onFilterClick}
          >
            <Image
              style={{ width: 20, height: 20, tintColor: COLORS.black_txt }}
              resizeMode={"cover"}
              source={filter}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 35 }} />
        )}
      </View>
    </View>
  );
}

export default Header;
