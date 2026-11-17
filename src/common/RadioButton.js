import React, { Component, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { COLORS, FONTS_SIZE, FONTS, elevation } from "../common/utils";
import TextCommonregular from "./TextCommonregular";
import TextCommonSemiBlod from "./TextCommonSemiBlod";

function RadioButton({ onPress, visible, text, image }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 15,
        backgroundColor: COLORS.bg_color,
        borderWidth: 2,
        borderColor: visible === true ? COLORS.primary : COLORS.bg_color,
        flex: 1,
        shadowColor: COLORS.shadow_color,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        elevation: elevation,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 10,
          paddingBottom: 8,
          borderRadius: 5,
          flex: 1,
          position: "absolute",
          top: 8,
        }}
      >
        <TextCommonSemiBlod
          text={text}
          color={visible === true ? COLORS.primary : COLORS.color_1B1A1A}
          fontSize={FONTS_SIZE.txt_16}
          fontWeight={"400"}
          numberOfLines={2}
        />
      </View>

      <View
        style={{
          padding: 10,
          borderRadius: 15,
          marginTop: 13,
        }}
      >
        <Image
          source={image}
          style={
            text === "Influencer"
              ? { width: 80, height: 80 }
              : { width: 80, height: 80 }
          }
        />
      </View>
    </TouchableOpacity>
  );
}

export default RadioButton;
