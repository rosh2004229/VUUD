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

function ItemExploreInfuencerList({ item, onItemClick }) {
  //const boxSize = Dimensions.get("window").width / 2 - 15;
  const boxSize = Dimensions.get('window').width - 22;

  return (
    <TouchableOpacity
      onPress={onItemClick}
      activeOpacity={activeOpacity}
      style={{
        marginTop: 2,
        // marginStart: 20,
        marginEnd: 7,
        marginBottom: 5,
        // alignItems: "center",
        // justifyContent: "center",
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: COLORS.gry_light,
        height: 145,
        width: 115,
        //flexDirection: 'row',
        // shadowColor: COLORS.shadow_color,
        // shadowOffset: { width: -2, height: 4 },
        // shadowOpacity: 0.2,
        // shadowRadius: 10,
        // elevation: elevation,
        backgroundColor: COLORS.white_original,
      }}
    >
      <View
        onPress={onItemClick}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          height: 90,
        }}
      >
        <View
          style={{
            width: '100%',
            height: 100,
            // position: 'absolute',
            //left: -20,
            // bottom: 20,
            //borderRadius: 60 / 2,
            //  borderWidth: 1,
            // borderColor: '#469520',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }}
        >
          {/* <Image
            // style={{ width: boxSize, height: boxSize }}
            style={{
              width: '100%',
              height: 90,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              // borderRadius: 58 / 2,
            }}
            //source={require("../assets/profileimage.png")}
            source={
              item != null &&
                item != undefined &&
                item.image != null &&
                item.image != undefined
                ? {
                  uri: IMG_BASE_URL + item.image,
                }
                : require('../assets/user_pro.png')
            }
            resizeMode={'cover'}
          /> */}


          <FastImage
            style={{
              width: '100%',
              height: 90,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              // borderRadius: 58 / 2,
            }}
            source={
              item != null &&
                item != undefined &&
                item.image != null &&
                item.image != undefined
                ? {
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
          justifyContent: 'center',
          alignItems: 'center',
          paddingStart: 8,
          paddingEnd: 8,
          paddingHorizontal: 10,
          marginTop: 5,
        }}
      >
        <TextCommonSemiBlod
          //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
          text={item.fullname != undefined ? item.fullname : ''}
          fontSize={FONTS_SIZE.txt_12}
          fontWeight={'500'}
          color={COLORS.comment_bg_color}
          numberOfLines={1}
          includeFontPadding={false}
          textAlign={'left'}
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
          numberOfLines={1}
          textAlign={'left'}
          includeFontPadding={false}
        /> */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
            alignSelf: 'center',
          }}
        >
          {
            item.instagram_count != null && item.instagram_count != "0" && item.instagram_count != 0 && item.instagram_count != undefined ?
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  // style={{ width: boxSize, height: boxSize }}
                  style={{
                    width: 14,
                    height: 14,
                  }}
                  source={require('../assets/instagram.png')}
                  resizeMode={'cover'}
                />
                <TextCommonMedium
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
                      ? kFormatter(item.instagram_count)
                      : '0'
                  }
                  fontSize={FONTS_SIZE.txt_11}
                  // fontWeight={"100"}
                  color={COLORS.comment_bg_color}
                  marginLeft={2}
                  numberOfLines={2}
                  // textAlign={'left'}
                  includeFontPadding={false}
                />
              </View>
              : null
          }


          {
            item.youtube_count != null && item.youtube_count != "0" && item.youtube_count != 0 && item.youtube_count != undefined ?
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 4,
                }}
              >
                <Image
                  // style={{ width: boxSize, height: boxSize }}
                  style={{
                    width: 20,
                    height: 20,
                    // tintColor: COLORS.fb_color,
                  }}
                  source={require('../assets/youtube.png')}
                  resizeMode={'stretch'}
                />
                <TextCommonMedium
                  //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
                  text={
                    item.youtube_count != null && item.youtube_count != undefined
                      ? kFormatter(item.youtube_count)
                      : '0'
                  }
                  fontSize={FONTS_SIZE.txt_11}
                  // fontWeight={"100"}
                  color={COLORS.comment_bg_color}
                  //marginTop={2}
                  marginLeft={2}
                  numberOfLines={2}
                  //  textAlign={'left'}
                  includeFontPadding={false}
                />
              </View>
              :
              null
          }


          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 5,
            }}
          >
            <Image
              // style={{ width: boxSize, height: boxSize }}
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.fb_color,
              }}
              source={require('../assets/facebook.png')}
              resizeMode={'cover'}
            />
            <TextCommonSemiBlod
              //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
              text={
                item.facebook_count != null && item.facebook_count != undefined
                  ? item.facebook_count
                  : '0'
              }
              fontSize={FONTS_SIZE.txt_12}
              // fontWeight={"100"}
              color={COLORS.comment_bg_color}
              marginTop={2}
              marginLeft={6}
              numberOfLines={2}
              textAlign={'left'}
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
    </TouchableOpacity>
  );
}

export default ItemExploreInfuencerList;
