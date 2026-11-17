import React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import TextCommonSemiBlod from '../common/TextCommonSemiBlod';
import {
  COLORS,
  FONTS_SIZE,
  IMG_BASE_URL,
  activeOpacity,
  elevation,
  kFormatter,
  // getInstagramFollowers,
} from '../common/utils';
import TextCommonMedium from '../common/TextCommonMedium';
import TextCommonregular from '../common/TextCommonregular';
//import CardView from "react-native-cardview";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function ItemHashTagList({ item, onItemClick }) {
  const boxSize = Dimensions.get('window').width - 20;

  return (
    <TouchableOpacity
      onPress={onItemClick}
      activeOpacity={activeOpacity}
      style={{
        width: boxSize,
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <View
        onPress={onItemClick}
        activeOpacity={activeOpacity}
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 15,
          paddingBottom: 15,
        }}
      >
        <TextCommonSemiBlod
          //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
          text={item.hashtag != undefined ? '#' + item.hashtag : ''}
          fontSize={FONTS_SIZE.txt_13}
          fontWeight={'500'}
          color={COLORS.comment_bg_color}
          numberOfLines={1}
          includeFontPadding={false}
          textAlign={'left'}
          width={wp(80)}
          backgroundColor={'red'}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: 0.8,
          backgroundColor: COLORS.very_light_grey,
        }}
      />
    </TouchableOpacity>
  );
}

export default ItemHashTagList;
