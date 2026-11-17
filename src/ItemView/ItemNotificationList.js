import React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import TextCommonMedium from '../common/TextCommonMedium';
import TextCommonSemiBlod from '../common/TextCommonSemiBlod';
import {
  COLORS,
  FONTS_SIZE,
  IMG_BASE_URL,
  activeOpacity,
  elevation,
} from '../common/utils';
import moment from 'moment/moment';
import ButtonView from '../common/ButtonView';
import FastImage from 'react-native-fast-image';
function ItemNotificationList({
  item,
  onItemClick,
  onAcceptClick,
  onRejectClick,
}) {
  const boxSize = Dimensions.get('window').width - 22;

  return (
    <TouchableOpacity
      onPress={onItemClick}
      activeOpacity={activeOpacity}
      style={{
        marginTop: 2,
        marginBottom: 5,
        borderRadius: 10,
        // height: 87,
        paddingTop: 20,
        paddingBottom: 5,
        width: boxSize,
        flexDirection: 'row',
        shadowColor: COLORS.shadow_color,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: elevation,
        backgroundColor: COLORS.white_original,
      }}
    >
      <View
        onPress={onItemClick}
        style={{
          //   justifyContent: 'center',
          // borderRadius: 10,
          height: 65,
          marginLeft: 10,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 60 / 2,
            borderWidth: 1,
            borderColor: COLORS.light_pink,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FastImage
            style={{
              width: 58,
              height: 58,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 58 / 2,
            }}
            source={
              item != null &&
                item != undefined &&
                item.image != null &&
                item.image != undefined
                ? {
                  uri: IMG_BASE_URL + item.image,
                  priority: FastImage.priority.high,
                }
                : require('../assets/user_pro.png')
            }
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </View>

      <View
        style={{
          marginLeft: 10,
          // justifyContent: 'center',
          width: '75%',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextCommonSemiBlod
            text={item.fullname != undefined && item.fullname != null ? item.fullname : ''}
            fontSize={FONTS_SIZE.txt_14}
            fontWeight={'500'}
            color={COLORS.comment_bg_color}
            includeFontPadding={false}
          />
        </View>

        <TextCommonMedium
          text={item.city != undefined && item.city != null ? item.city : ''}
          fontSize={FONTS_SIZE.txt_12}
          fontWeight={'500'}
          color={COLORS.comment_bg_color}
          includeFontPadding={false}
          textAlign={'left'}
          marginTop={2}
        />

        <TextCommonMedium
          text={item.description != undefined && item.description != null ? item.description : ''}
          fontSize={FONTS_SIZE.txt_12}
          fontWeight={'500'}
          color={COLORS.gry_light}
          numberOfLines={2}
          includeFontPadding={false}
          textAlign={'left'}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          top: 5,
          right: 10,
          //backgroundColor: "green"
        }}
      >
        <TextCommonMedium
          text={
            item.created_at != undefined
              ? moment(item.created_at).fromNow()
              : ''
          }
          fontSize={FONTS_SIZE.txt_10}
          fontWeight={'600'}
          color={COLORS.gry_light}
        //numberOfLines={1}
        />
      </View>
    </TouchableOpacity>
  );
}

export default ItemNotificationList;
