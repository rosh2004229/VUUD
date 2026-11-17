import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS_SIZE, FONTS } from './utils';

function TextInputView({
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  imageSource,
  onEyeClick
}) {
  return (
    <View
      style={{
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.border_color,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15

      }}>
      <TextInput
        style={{
          color: COLORS.black_txt,
          fontSize: FONTS_SIZE.txt_14,
          fontWeight: '400',
          fontFamily: FONTS.FontRegular,
          flex: 1,
          paddingRight: 15
        }}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      <TouchableOpacity
        onPress={onEyeClick}
        style={{ width: 25, height: 25 }}
      >

        <Image
          style={{
            height: 22,
            width: 22,
          }}
          source={imageSource}
        />
      </TouchableOpacity>

    </View>
  );
}

export default TextInputView;
