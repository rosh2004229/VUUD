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

function ItemRequestItem({
  item,
  onItemClick,
  onAcceptClick,
  onRejectClick,
  sendMessage,
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
        paddingTop: 10,
        paddingBottom: 10,
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
          // alignItems: "center",
          // flexDirection: "column",
          marginLeft: 10,
          //  justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            width: 55,
            height: 55,
            borderRadius: 55 / 2,
            borderWidth: 1,
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
                item != undefined && item.influencer != undefined && item.influencer != null &&
                item.influencer.image != null &&
                item.influencer.image != undefined
                ? {
                  uri: IMG_BASE_URL + item.influencer.image,
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
              item.influencer != undefined && item.influencer != null && item.influencer.fullname != undefined
                ? item.influencer.fullname
                : ''
            }
            fontSize={FONTS_SIZE.txt_15}
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
          text={item.description != undefined ? item.description : ''}
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
          <View>
            {item.isread != 1 || item.status == '3' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 5,

                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onAcceptClick}
                  style={{
                    // backgroundColor: COLORS.colorGreen,
                    borderColor: COLORS.colorGreen,
                    borderRadius: 30,
                    height: 32,
                    width: 80,
                    borderWidth: 0.8,
                    paddingLeft: 6,
                    paddingRight: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextCommonSemiBlod
                    text={'Accept'}
                    // color={COLORS.white_txt}
                    color={COLORS.colorGreen}
                    fontSize={FONTS_SIZE.txt_12}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onRejectClick}
                  style={{
                    // backgroundColor: COLORS.color_red,
                    borderColor: COLORS.color_red,
                    borderRadius: 30,
                    height: 32,
                    width: 80,
                    marginLeft: 10,
                    borderWidth: 0.8,
                    paddingLeft: 6,
                    paddingRight: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextCommonSemiBlod
                    text={'Reject'}
                    // color={COLORS.white_txt}
                    color={COLORS.color_red}
                    fontSize={FONTS_SIZE.txt_13}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
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
                // alignItems: "center",
                // justifyContent: "center",
                // borderWidth: 0.5,
                // flexDirection: "row"
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
          paddingHorizontal: item.isread != 1 || item.status == '3' ? 0 : 10,
          paddingVertical: item.isread != 1 || item.status == '3' ? 0 : 3,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          // borderBottomRightRadius: 10
        }}
      >
        {item.isread != 1 || item.status == '3' ? null : (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View>
              <TextCommonSemiBlod
                text={statusName(item.status)}
                color={statusColor(item.status)}
                fontSize={FONTS_SIZE.txt_13}
              />
            </View>
          </View>
        )}

      </View>
    </TouchableOpacity>
  );
}

export default ItemRequestItem;
