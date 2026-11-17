import React, { Component, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions
} from "react-native";
import { COLORS, FONTS_SIZE } from "../common/utils";
import TextCommonregular from "../common/TextCommonregular";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

function EmptyView({ msgText }) {
  return (
    <View
      style={{
        width: "88%",
        height: hp(60),
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center'
      }}
    >
      <TextCommonregular
        text={msgText}
        color={COLORS.black_light_txt}
        fontSize={FONTS_SIZE.txt_14}
        lineHeight={23}
        fontWeight={"400"}
        marginTop={10}
        textAlign={'center'}
      />
    </View>
  );
}

export default EmptyView;
