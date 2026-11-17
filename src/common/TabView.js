import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import TextCommonMedium from './TextCommonMedium';
import TextCommonSemiBlod from './TextCommonSemiBlod';
import { COLORS, FONTS_SIZE, activeOpacity } from './utils';

const TabView = ({
  icon,
  txt,
  onPress,
  txtColor,
  borderBottomColor,
  tintColor,
  tabBgColor,
  visible,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={{
        padding: 7,
        flex: 1,
        alignItems: 'center',
        backgroundColor: tabBgColor,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}
      >
        {/* {icon != undefined ? (
          <Image
            resizeMode="contain"
            source={icon}
            style={{ width: 20, height: 20, tintColor: tintColor }}
          />
        ) : null} */}

        <TextCommonSemiBlod
          text={txt}
          color={txtColor}
          fontSize={FONTS_SIZE.txt_14}
          textAlign={'center'}
          numberOfLines={1}
        />
      </View>

      <View
        style={{
          borderBottomColor: borderBottomColor,
          borderBottomWidth: visible === true ? 1 : 0,
          width: 100,
          marginTop: 5,
        }}
      />
    </TouchableOpacity>
  );
};

export default TabView;
