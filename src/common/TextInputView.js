import React, { Component, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { COLORS, FONTS_SIZE, FONTS } from "../common/utils";
import TextCommonMedium from "./TextCommonMedium";

function TextInputView({
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  placeholderTextColor,
  backgroundColor,
  editable,
  maxLength,
  height,
  text,
  numberOfLines,
  multiline,
  isPassword,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return Platform.OS === "ios" ? (
    <>
      <View
        style={{
          height: multiline === true ? height : 55,
          backgroundColor: COLORS.white_original,
          borderRadius: 8,
          paddingHorizontal: 10,
          width: text != undefined && text != null ? "100%" : "80%",
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          marginTop: 10,
          elevation: 3,
          justifyContent: "center",
        }}
      >
        {text != undefined && text != null ? (
          <TextCommonMedium
            text={text}
            color={COLORS.black_txt}
            fontSize={FONTS_SIZE.txt_14}
            fontWeight={"500"}
          />
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!value && (
            <Text
              style={{
                position: "absolute",
                color: COLORS.gry_text,
                fontSize: FONTS_SIZE.txt_14,
                fontFamily: FONTS.FontRegular,
                fontWeight: "500",
                height: height,
                left: 3,
                top: 8,
              }}
            >
              {placeholder}
            </Text>
          )}
          <TextInput
            style={{
              color: COLORS.black_txt,
              fontSize: FONTS_SIZE.txt_14,
              fontWeight: "500",
              fontFamily: FONTS.FontRegular,
              // textAlignVertical: 'top',
              height: height,
              flex: 1,
              // paddingLeft: 15,
            }}
            //  placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={isPassword && !isPasswordVisible}
            //secureTextEntry={false}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            backgroundColor={backgroundColor}
            editable={editable}
            maxLength={maxLength}
            numberOfLines={numberOfLines}
            multiline={multiline}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Image
                source={
                  isPasswordVisible
                    ? require("../assets/hiddenPasswordHide.png") // Eye icon for visible password
                    : require("../assets/showPasswordEye.png") // Eye icon for hidden password
                }
                style={{ width: 24, height: 24, tintColor: COLORS.gry_text }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  ) : (
    <>
      <View
        style={{
          // height: height,
          backgroundColor: COLORS.white_original,
          borderRadius: 8,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 10 : 4,
          paddingHorizontal: 10,
          width: text != undefined && text != null ? "100%" : "80%",
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          marginTop: 10,
          elevation: 3,
          // backgroundColor: 'red'
        }}
      >
        {text != undefined && text != null ? (
          <TextCommonMedium
            text={text}
            color={COLORS.black_txt}
            fontSize={FONTS_SIZE.txt_14}
            fontWeight={"500"}
          />
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!value && (
            <Text
              style={{
                position: "absolute",
                color: COLORS.gry_text,
                fontSize: FONTS_SIZE.txt_14,
                fontFamily: FONTS.FontRegular,
                fontWeight: "500",
                height: height,
                left: 3,
              }}
            >
              {placeholder}
            </Text>
          )}
          <TextInput
            style={{
              color: COLORS.black_txt,
              fontSize: FONTS_SIZE.txt_14,
              fontWeight: "500",
              fontFamily: FONTS.FontRegular,
              // textAlignVertical: 'top',
              height: height,
              flex: 1,
              // paddingLeft: 15,
            }}
            //  placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={isPassword && !isPasswordVisible}
            //secureTextEntry={false}
            keyboardType={keyboardType}
            placeholderTextColor={placeholderTextColor}
            backgroundColor={backgroundColor}
            editable={editable}
            maxLength={maxLength}
            numberOfLines={numberOfLines}
            multiline={multiline}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Image
                source={
                  isPasswordVisible
                    ? require("../assets/hiddenPasswordHide.png") // Eye icon for visible password
                    : require("../assets/showPasswordEye.png") // Eye icon for hidden password
                }
                style={{ width: 24, height: 24, tintColor: COLORS.gry_text }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

export default TextInputView;
