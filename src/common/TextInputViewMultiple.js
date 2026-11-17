import React, {Component, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {COLORS, FONTS_SIZE, FONTS} from './utils';

function TextInputViewMultiple({
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
        justifyContent: 'center',
        marginTop: 10,
        height: 120,
      }}>
      <TextInput
        style={{
          color: COLORS.black_txt,
          fontSize: FONTS_SIZE.txt_14,
          fontWeight: '500',
          fontFamily: FONTS.FontRegular,
          paddingLeft: 15,
          textAlignVertical: 'top',
          height: 120,
        }}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderTextColor}
        backgroundColor={backgroundColor}
        editable={editable}
        multiline
        returnKeyType="done"
      />
    </View>
  );
}

export default TextInputViewMultiple;
