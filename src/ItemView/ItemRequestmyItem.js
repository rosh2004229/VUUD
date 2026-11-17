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
  statusColor,
  statusName,
} from '../common/utils';
import moment from 'moment/moment';
import ButtonView from '../common/ButtonView';
import FastImage from 'react-native-fast-image';
function ItemRequestmyItem({ item, onItemClick, onCancelClick, sendMessage }) {
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
        paddingTop: 10,
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
          // height: 70,
          marginLeft: 10,
        }}
      >
        <View
          style={{
            width: 55,
            height: 55,
            borderRadius: 55 / 2,
            borderWidth: 2,
            borderColor: COLORS.light_pink,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FastImage
            style={{
              width: 52,
              height: 52,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 52 / 2,
            }}
            source={
              item != null &&
                item != undefined &&
                item.user != null &&
                item.user != undefined
                ? {
                  uri: IMG_BASE_URL + item.user.image,
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
          // width: '45%',
          width: '79.5%',
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
            text={
              item != undefined && item.user != undefined && item.user != null
                ? item.user.fullname
                : ''
            }
            fontSize={FONTS_SIZE.txt_15}
            fontWeight={'500'}
            color={COLORS.comment_bg_color}
            includeFontPadding={false}
          />
        </View>

        <TextCommonMedium
          text={
            item != undefined && item.city != undefined && item.city != null
              ? item.city
              : ''
          }
          fontSize={FONTS_SIZE.txt_12}
          fontWeight={'500'}
          color={COLORS.comment_bg_color}
          includeFontPadding={false}
          textAlign={'left'}
          width={130}
          marginTop={2}
        />

        <TextCommonMedium
          text={
            item != undefined && item.description != undefined
              ? item.description
              : ''
          }
          fontSize={FONTS_SIZE.txt_12}
          fontWeight={'500'}
          color={COLORS.gry_light}
          numberOfLines={2}
          includeFontPadding={false}
          textAlign={'left'}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
            // alignItems: 'center',
            // position: 'absolute',
            // top: 5,
            // right: 10,
            //backgroundColor: "green"
          }}
        >
          <TextCommonMedium
            text={
              item != undefined && item.created_at != undefined
                ? moment(item.created_at).fromNow()
                : ''
            }
            fontSize={FONTS_SIZE.txt_10}
            fontWeight={'600'}
            color={COLORS.gry_light}
          //numberOfLines={1}
          />
          <View>
            {item != undefined &&
              item.isread != undefined &&
              item.isread != null &&
              item.isread === 1 ? null :
              item.status != '4' &&
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 5,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onCancelClick}
                  style={{
                    // backgroundColor: COLORS.color_red,
                    borderColor: COLORS.color_red,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    // height: 32,
                    // width: 110,
                    // marginLeft: 10,
                    borderWidth: 0.7,
                    // paddingLeft: 5,
                    // paddingRight: 5,
                    // flexDirection: 'row',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                  }}
                >
                  {/* <Image
            style={{
              width: 26,
              height: 26,
              marginBottom: 2
              // tintColor: COLORS.gry_text,
            }}
            source={require('../assets/cancel.png')}
            resizeMode={'contain'}
          /> */}
                  <TextCommonSemiBlod
                    text={'Cancel Request'}
                    color={COLORS.color_red}
                    fontSize={FONTS_SIZE.txt_12}
                  />
                </TouchableOpacity>
              </View>
            }
          </View>

          {item.status == '1' && (
            <TouchableOpacity
              style={{
                // backgroundColor: COLORS.colorGreen,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 5,
                marginRight: 2,
                borderRadius: 8,
                borderColor: 'green',
                flexDirection: 'row',
                borderWidth: 0.7,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10
              }}
              onPress={sendMessage}
            >

              <Image
                style={{
                  width: 18,
                  height: 18,
                  // backgroundColor: "red",
                  marginTop: 2,
                  marginRight: 5
                  // marginRight: 10,

                  // tintColor: COLORS.gry_text,
                }}
                source={require("../assets/message.png")}
                resizeMode={"contain"}
              />

              <TextCommonSemiBlod
                text={'Message'}
                color={COLORS.black_txt}
                fontSize={FONTS_SIZE.txt_13}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: "#00000010",
          paddingHorizontal: item.isread != 1 && item.status != '4' ? 0 : 10,
          paddingVertical: item.isread != 1 && item.status != '4' ? 3 : 0,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        {item != undefined &&
          item.isread != undefined &&
          item.isread != null &&
          item.isread === 1 ? (
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <TextCommonSemiBlod
              text={statusName(item.status)}
              color={statusColor(item.status)}
              fontSize={FONTS_SIZE.txt_13}
            />

          </View>
        ) : (
          item.status == '4' ?
            <TextCommonSemiBlod
              text={statusName(item.status)}
              color={statusColor(item.status)}
              fontSize={FONTS_SIZE.txt_13}
            /> :
            null
        )}
      </View>

    </TouchableOpacity>
  );
}

export default ItemRequestmyItem;
