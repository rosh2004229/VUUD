import React, {Component, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import {COLORS, FONTS_SIZE, FONTS} from './utils';

function TextInputView2({
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  placeholderTextColor,
  backgroundColor,
  editable,
}) {
  return (
    <View
      style={{
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.border_color,
        justifyContent: 'space-between',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
      }}>
      <TextInput
        style={{
          color: COLORS.black_txt,
          fontSize: FONTS_SIZE.txt_14,
          fontFamily: FONTS.FontRegular,
          paddingLeft: 15,
          paddingRight: 15,
          width: '90%',
        }}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderTextColor}
        backgroundColor={backgroundColor}
        editable={editable}
      />
      <Image
        style={{
          width: 13,
          height: 13,
          tintColor: COLORS.placehld_txtcolor,
        }}
        source={require('../assets/down_arrow_icon.png')}
      />
    </View>
  );
}

export default TextInputView2;
