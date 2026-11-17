import React, { Component, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS_SIZE, FONTS, elevation } from './utils';
import TextCommonregular from './TextCommonregular';
import TextCommonSemiBlod from './TextCommonSemiBlod';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
let { width, height } = Dimensions.get('window');

let boxCount = 2;
let boxWidth = width / boxCount;

function statusView(status, count, txt) {
  const progressView = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: boxWidth,
            justifyContent: 'center',
          }}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* <Image
              resizeMode="contain"
              source={
                status > count
                  ? require("../../assets/check_icon.png")
                  : status === count
                  ? require("../../assets/selected_icon.png")
                  : require("../../assets/unselcted_icon.png")
              }
              style={{
                width: 25,
                height: 25,
              }}
            /> */}

            <View
              style={{
                width: 18,
                height: 18,
                backgroundColor:
                  status > count
                    ? COLORS.primary
                    : status === count
                      ? COLORS.primary
                      : COLORS.blue_light,
                borderRadius: 18 / 2,
                justifyContent: 'center',
              }}
            ></View>

            {/* <TextCommonMedium
              text={txt}
              fontSize={FONTS_SIZE.txt_12}
              fontWeight={'500'}
              color={
                status === count || status > count
                  ? COLORS.color_469520
                  : COLORS.blue_light
              }
              marginTop={5}
              numberOfLines={2}
              textAlign={'center'}
            /> */}
          </View>

          {count === 8 ? null : (
            <View
              style={{
                // width: 75,
                width: wp(10),
                height: 1,
                backgroundColor:
                  status > count ? COLORS.color_469520 : COLORS.blue_light,
                position: 'absolute',
                top: 9,
                left: boxWidth / 2 + 10,
                // left: 60,
              }}
            />
          )}
        </View>
      </View>
    );
  };

  return progressView();
}

export default statusView;
