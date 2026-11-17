import React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import TextCommonSemiBlod from '../common/TextCommonSemiBlod';
import {
  COLORS,
  FONTS_SIZE,
  IMG_BASE_URL,
  activeOpacity,
  elevation,
  getInstagramFollowers,
  kFormatter,
} from '../common/utils';
import TextCommonMedium from '../common/TextCommonMedium';
import FastImage from 'react-native-fast-image';
//import CardView from "react-native-cardview";

function ItemInfluencerCategory({ item, onItemClick }) {
  const boxSize = Dimensions.get('window').width / 3 - 10;
  // const boxSize = Dimensions.get('window').width - 22;

  return (
    <TouchableOpacity
      onPress={onItemClick}
      activeOpacity={activeOpacity}
      style={{
        marginTop: 2,
        marginEnd: 7,
        marginBottom: 5,
        borderRadius: 2,
        borderWidth: 0.3,
        borderColor: COLORS.very_light_pink,
        height: 115,
        width: boxSize,
        justifyContent: 'center',
        alignItems: 'center',
        //  backgroundColor: COLORS.very_light_grey,
      }}
    >
      <View
        onPress={onItemClick}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          height: 70,
        }}
      >
        <FastImage
          // style={{ width: boxSize, height: boxSize }}
          style={{
            width: 70,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            // borderTopRightRadius: 2,
            //  borderTopLeftRadius: 2,
            // borderRadius: 58 / 2,
          }}
          //source={require("../assets/profileimage.png")}
          source={
            item != null &&
              item != undefined &&
              item.icon != null &&
              item.icon != undefined
              ? {
                uri: IMG_BASE_URL + item.icon,
                priority: FastImage.priority.high
              }
              : require('../assets/user_pro.png')
          }
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingStart: 8,
          paddingEnd: 8,
          marginTop: 5,
        }}
      >
        <TextCommonSemiBlod
          text={
            item.category_name != undefined && item.category_name != null
              ? item.category_name
              : item.name != undefined && item.name != null
              ? item.name
              : ''
          }
          fontSize={FONTS_SIZE.txt_12}
          fontWeight={'500'}
          color={COLORS.comment_bg_color}
          numberOfLines={1}
          includeFontPadding={false}
          textAlign={'left'}
        />
      </View>
    </TouchableOpacity>
  );
}

export default ItemInfluencerCategory;
