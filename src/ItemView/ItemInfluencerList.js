import React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import TextCommonSemiBlod from '../common/TextCommonSemiBlod';
import {
  COLORS,
  FONTS_SIZE,
  IMG_BASE_URL,
  activeOpacity,
  elevation,
  formatWithCommas,
  kFormatter,
  // getInstagramFollowers,
} from '../common/utils';
import TextCommonMedium from '../common/TextCommonMedium';
import TextCommonregular from '../common/TextCommonregular';
import FastImage from 'react-native-fast-image';
//import CardView from "react-native-cardview";

function ItemInfluencerList({ item, onItemClick }) {
  //const boxSize = Dimensions.get("window").width / 2 - 15;
  const boxSize = Dimensions.get('window').width - 20;


  return (
    <TouchableOpacity
      onPress={onItemClick}
      activeOpacity={activeOpacity}
      style={{
        marginTop: 2,
        // marginStart: 20,
        // marginEnd: 20,
        marginBottom: 5,
        // alignItems: "center",
        // justifyContent: "center",
        borderRadius: 10,
        height: 80,
        width: boxSize,
        flexDirection: 'row',
        shadowColor: COLORS.shadow_color,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: elevation,
        backgroundColor: COLORS.white_original,
        alignItems: 'center',
      }}
    >
      <View
        onPress={onItemClick}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          height: 70,
          marginLeft: 10,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            // position: 'absolute',
            //left: -20,
            // bottom: 20,
            borderRadius: 60 / 2,
            borderWidth: 1,
            borderColor: COLORS.light_pink,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FastImage
            // style={{ width: boxSize, height: boxSize }}
            style={{
              width: 58,
              height: 58,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 58 / 2,
            }}
            //source={require("../assets/profileimage.png")}
            source={
              item != null &&
                item != undefined &&
                item.image != null &&
                item.image != undefined
                ? {
                  //uri: IMG_BASE_URL + item.profile_image[0].image,
                  uri: IMG_BASE_URL + item.image,
                  priority: FastImage.priority.high
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
          justifyContent: 'center',
        }}
      >
        <TextCommonSemiBlod
          //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
          text={item.fullname != undefined ? item.fullname : ''}
          fontSize={FONTS_SIZE.txt_13}
          fontWeight={'500'}
          color={COLORS.comment_bg_color}
          numberOfLines={1}
          includeFontPadding={false}
          textAlign={'left'}
          width={170}
          backgroundColor={'red'}
        />
        {/* <TextCommonMedium
          //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
          text={
            item.instagram_username != null &&
            item.instagram_username != undefined
              ? item.instagram_username
              : ''
          }
          fontSize={FONTS_SIZE.txt_12}
          // fontWeight={"100"}
          color={COLORS.gry_text}
          numberOfLines={2}
          textAlign={'left'}
          includeFontPadding={false}
        /> */}

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}
        >
          {
            item.instagram_count != null && item.instagram_count != '0' && item.instagram_count != 0 && item.instagram_count != undefined ?
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  // style={{ width: boxSize, height: boxSize }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={require('../assets/instagram.png')}
                  resizeMode={'cover'}
                />
                <TextCommonSemiBlod
                  // text={
                  //   item.instagram_username != null &&
                  //   item.instagram_username != undefined
                  //     ? getInstagramFollowers(item.instagram_username) === '0'
                  //       ? item.instagram_count != null &&
                  //         item.instagram_count != undefined
                  //         ? item.instagram_count
                  //         : getInstagramFollowers(item.instagram_username)
                  //       : '0'
                  //     : '0'
                  // }

                  text={
                    item.instagram_count != null &&
                      item.instagram_count != undefined
                      ? formatWithCommas(item.instagram_count)
                      : '0'
                  }
                  fontSize={FONTS_SIZE.txt_12}
                  // fontWeight={"100"}
                  color={COLORS.comment_bg_color}
                  marginLeft={6}
                  numberOfLines={2}
                  textAlign={'left'}
                  includeFontPadding={false}
                />
              </View>
              : null
          }

          {
            item.youtube_count != null && item.youtube_count != '0' && item.youtube_count != 0 && item.youtube_count != undefined ?
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                }}
              >
                <Image
                  // style={{ width: boxSize, height: boxSize }}
                  style={{
                    width: 26,
                    height: 26,
                    // tintColor: COLORS.fb_color,
                  }}
                  source={require('../assets/youtube.png')}
                  resizeMode={'stretch'}
                />
                <TextCommonSemiBlod
                  //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
                  text={
                    item.youtube_count != null && item.youtube_count != undefined
                      ? formatWithCommas(item.youtube_count)
                      : '0'
                  }
                  fontSize={FONTS_SIZE.txt_12}
                  // fontWeight={"100"}
                  color={COLORS.comment_bg_color}
                  // marginTop={2}
                  marginLeft={6}
                  numberOfLines={2}
                  textAlign={'left'}
                  includeFontPadding={false}
                />
              </View>
              : null
          }


          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20
            }}
          >
            <Image
              // style={{ width: boxSize, height: boxSize }}
              style={{
                width: 22,
                height: 22,
                tintColor: COLORS.fb_color
              }}
              source={require("../assets/facebook.png")}
              resizeMode={"cover"}
            />
            <TextCommonSemiBlod
              //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
              text={
                item.facebook_count != null && item.facebook_count != undefined
                  ? item.facebook_count
                  : "0"
              }
              fontSize={FONTS_SIZE.txt_12}
              // fontWeight={"100"}
              color={COLORS.comment_bg_color}
              marginTop={2}
              marginLeft={6}
              numberOfLines={2}
              textAlign={"left"}
              includeFontPadding={false}
            />
          </View> */}

          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20
            }}
          >
            <Image
              // style={{ width: boxSize, height: boxSize }}
              style={{
                width: 22,
                height: 22,
                tintColor: COLORS.twitter_color
              }}
              source={require("../assets/twitter.png")}
              resizeMode={"cover"}
            />
            <TextCommonSemiBlod
              //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
              text={
                item.twitter_count != null && item.twitter_count != undefined
                  ? item.twitter_count
                  : "0"
              }
              fontSize={FONTS_SIZE.txt_12}
              // fontWeight={"100"}
              color={COLORS.comment_bg_color}
              marginTop={2}
              marginLeft={6}
              numberOfLines={2}
              textAlign={"left"}
              includeFontPadding={false}
            />
          </View> */}
        </View>
      </View>
      {
        item.city != undefined && item.city != null && item.city != "" ? (
          <View
            style={{
              position: 'absolute',
              top: 6,
              right: 5,
              borderRadius: 30,
              backgroundColor: COLORS.very_light_grey,
              paddingStart: 8,
              paddingEnd: 8,
              paddingTop: 2,
              paddingBottom: 2,
            }}
          >
            <TextCommonregular
              //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
              text={
                item.city != undefined && item.city != null && item.city != "" ? item.city.city : ''
              }
              fontSize={FONTS_SIZE.txt_10}
              // fontWeight={"100"}
              color={COLORS.gry_text}
              numberOfLines={1}
              textAlign={'left'}
              includeFontPadding={false}
            />
          </View>
        ) : null
      }

    </TouchableOpacity>
  );
}

export default ItemInfluencerList;
