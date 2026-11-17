import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Carousel } from "react-native-reanimated-carousel";
import DialogMoreOptionsOtherProfile from "../common/DialogMoreOptionsOtherProfile";
import LogoutDialog from "../common/LogoutDialog";
import SnackBarCommon from "../common/SnackBarCommon";
import TextCommonMedium from "../common/TextCommonMedium";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import {
  COLORS,
  FONTS_SIZE,
  IMG_BASE_URL,
  StatusBarHeight,
  activeOpacity,
  analyticsLog,
  formatWithCommas,
} from "../common/utils";
import TextCommonregular from "../common/TextCommonregular";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import Loader from "../common/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabView from "../common/TabView";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/routers";
import EmptyView from "../common/EmptyView";
import FastImage from "react-native-fast-image";
import Video from 'react-native-video';
function UserProfilePage({ navigation, route }) {
  // const { item, type } = route.params;
  const [advertisementBannerList, setAdvertisementBannerList] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [connectDialogVisible, setconnectDialogVisible] = useState(false);
  const boxSize = Dimensions.get("window").width;
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [about, setAbout] = useState(true);
  const [media, setMedia] = useState(false);
  const [description, setDescription] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      getData(false);
      analyticsLog("Profile_screen");
    }, [])
  );

  useEffect(() => {
    getData(false);
    setAbout(true);
    setMedia(false);
    setDescription(false);
  }, []);


  const openControlPanel = () => {
    if (navigation && typeof navigation.openDrawer === "function") { navigation.openDrawer(); } else if (DrawerActions && typeof DrawerActions.openDrawer === "function") { navigation.dispatch(DrawerActions.openDrawer()); }
  };

  const getData = async (pullrefresh) => {
    var user_id = await AsyncStorage.getItem("user_id");

    var user_type = await AsyncStorage.getItem("user_type");
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    var data = new FormData();
    //data.append('user_id', item);
    data.append("user_id", user_id);

    if (isInternetGranted == true) {
      if (pullrefresh === false) {
        setisLoading(true);
      }

      console.log(data);
      onGetAllProfileDataAPICall(data);
    }
  };

  const onGetAllProfileDataAPICall = (data) => {
    APIWebCall.onGetUserAPICall(data, navigation)
      .then(async (response) => {
        setisLoading(false);

        setUserData(response.data.user);
        var apiArr = [];
        var apiList = response.data.user?.profile_image;
        if (apiList && apiList.length > 0) {
          apiList.forEach((element) => {
            const imgPath = element.image
              ? element.image.startsWith("http://") || element.image.startsWith("https://")
                ? element.image
                : IMG_BASE_URL + element.image
              : "";
            var obj = {
              illustration: imgPath,
              type: element.type,
            };
            apiArr.push(obj);
          });
        }
        setAdvertisementBannerList(apiArr);
      })
      .catch((err) => {
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => {
        setisLoading(false);
      });
  };
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={() => {
          navigation.navigate("ImageDetailPage", {
            allDataItem: advertisementBannerList,
          });
        }}
        style={{
          width: "100%",
          height: 305,
        }}
      >
        {item.type === "video" ? (
          <Video
            source={{ uri: item.illustration }}
            resizeMode="cover"
            paused={true}
            style={{
              width: "100%",
              height: 305,
            }}
          />
        ) : (
          <FastImage
            style={{
              width: "100%",
              height: 305,
            }}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: item.illustration,
              priority: FastImage.priority.high,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };
  const toggleModal = () => {
    setIsDialogVisible(!isDialogVisible);
  };

  const onReportClickView = () => {
    setIsDialogVisible(false);
    setTimeout(() => {
      // setReportDialogVisible(true);
      SnackBarCommon({ text: "You have already reported this user." });
      setIsReportVisible(true);
    }, 500);
  };

  const onReportClick = async () => {
    setisLoading(false);
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted === true) {
      var data = new FormData();
      data.append("id", item.toString());
      APIWebCall.onReportsUserAPICall(data)
        .then(async (response) => {
          setisLoading(false);
          setTimeout(() => {
            SnackBarCommon({ text: response.message, isSuccess: true });
          }, 500);
          navigation.goBack(null);
        })
        .catch((err) => {
          setisLoading(false);
          SnackBarCommon({ text: err });
        })
        .finally(() => {
          setisLoading(false);
        });
    }
  };

  const onBlockClick = async () => {
    setisLoading(false);
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted === true) {
      var data = new FormData();
      data.append("id", item.toString());
      APIWebCall.onBlockUserAPICall(data)
        .then(async (response) => {
          setisLoading(false);
          setTimeout(() => {
            SnackBarCommon({ text: response.message, isSuccess: true });
          }, 500);
          navigation.goBack(null);
        })
        .catch((err) => {
          setisLoading(false);
          SnackBarCommon({ text: err });
        })
        .finally(() => {
          setisLoading(false);
        });
    }
  };

  const socialViewCommon = (icon, followCount, onClick, iconName) => {
    return (
      <TouchableOpacity
        onPress={onClick}
        style={{
          // justifyContent: 'center',
          alignItems: "center",
          flexDirection: "row",
          //flex: 1,
          marginStart: 10,
        }}
      >
        <Image
          // style={{ width: boxSize, height: boxSize }}
          style={
            iconName === "insta"
              ? {
                width: 20,
                height: 20,
                marginRight: 8,
                //  tintColor: COLORS.color_868686,
              }
              : {
                width: 25,
                height: 25,
                marginRight: 8,
                //  tintColor: COLORS.color_868686,
              }
          }
          source={icon}
          resizeMode={"cover"}
        />
        <TextCommonSemiBlod
          //  text={item.name != undefined ? titleCase(item.name) : 'NA'}
          text={formatWithCommas(followCount.toString())}
          //text={item.followers}
          fontSize={FONTS_SIZE.txt_16}
          fontWeight={"100"}
          color={COLORS.color_868686}
          numberOfLines={2}
          includeFontPadding={false}
        />
      </TouchableOpacity>
    );
  };

  const DescriptionView = (title) => {
    return <EmptyView msgText={"No data found"} />;
  };
  const MediaView = (title) => {
    return (
      <View
        style={{
          //flex: 1,
          backgroundColor: COLORS.white_original,
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 0,
          marginLeft: 7,
          flexDirection: "row",
          // height: 150,
        }}
      >
        <FlatList
          style={{ flex: 1 }}
          data={advertisementBannerList}
          numColumns={3}
          // horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            // alignItems: 'center',
          }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={() => {
                  navigation.navigate("ImageDetailPage", {
                    // imgLink: item.path,
                    allDataItem: advertisementBannerList,
                  });
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 8,
                  width: 110,
                  height: 110,
                  borderRadius: 5,
                  //  borderWidth: 0.5,
                  marginHorizontal: 2,
                  // borderColor: COLORS.gry_text,
                  //backgroundColor: 'orange',
                }}
              >
                {item.type === "video" ? (
                  <Video
                    source={{ uri: item.illustration }}
                    resizeMode="stretch"
                    paused={true}
                    poster={"https://www.linkpicture.com/q/background_3.png"}
                    style={{
                      width: 105,
                      height: 105,
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <FastImage
                    // source={require('../assets/ic_add_photo_alternate_24px.png')}
                    source={{
                      uri: item.illustration,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{
                      width: 105,
                      height: 105,
                      borderRadius: 5,
                    }}
                  />
                )}

                {item.type === "video" ? (
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      position: "absolute",
                      right: 8,
                      top: 8,
                      tintColor: COLORS.white_original,
                    }}
                    source={require("../assets/video_reel_icon.png")}
                  />
                ) : null}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => {
            return <EmptyView msgText={"No data found"} />;
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    );
  };

  const AboutView = (title) => {
    return (
      <View
        style={{
          backgroundColor: COLORS.white_original,
          width: boxSize,
          // paddingLeft: 10,
          // paddingRight: 10,
          marginTop: 0,
          //alignItems: "center",
          paddingBottom: 10,
          paddingTop: 5,
        }}
      >
        {/* <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            marginLeft: 15,
            marginTop: 10,
          }}
        >
          <Image
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.gry_text,
            }}
            source={require('../assets/edit-info.png')}
            resizeMode={'contain'}
          />
          <TextCommonSemiBlod
            text={
              userData.fullname != undefined && userData.fullname != null
                ? userData.fullname
                : 'My Profile Name'
            }
            fontSize={FONTS_SIZE.txt_16}
            color={COLORS.gry_text}
            marginLeft={5}
          />
        </View> */}

        {userData != undefined && userData.user_type === "1" ? (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.gry_text,
              }}
              source={require("../assets/call.png")}
              resizeMode={"contain"}
            />
            <TextCommonregular
              text={userData.mobile != undefined ? userData.mobile : ""}
              fontSize={FONTS_SIZE.txt_13}
              color={COLORS.gry_text}
              marginLeft={5}
            />
          </View>
        ) : null}

        {userData != undefined &&
          userData.birthdate != undefined &&
          userData.birthdate != "" &&
          userData.birthdate != null &&
          userData.user_type === "1" ? (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              marginLeft: 10,
              marginTop: 7,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.gry_text,
              }}
              source={require("../assets/calendar_icon.png")}
              resizeMode={"contain"}
            />
            <TextCommonMedium
              text={userData.birthdate != undefined ? userData.birthdate : ""}
              fontSize={FONTS_SIZE.txt_13}
              fontWeight={"500"}
              color={COLORS.color_868686}
              numberOfLines={1}
              includeFontPadding={false}
              marginLeft={5}
            />
          </View>
        ) : null}

        {userData != undefined && userData.user_type === "1" ? (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              marginLeft: 10,
              marginTop: 7,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.gry_text,
              }}
              source={userData.email != undefined ? require("../assets/ic_message.png") : ""}
              resizeMode={"contain"}
            />
            <TextCommonregular
              text={userData.email != undefined ? userData.email : ""}
              fontSize={FONTS_SIZE.txt_13}
              fontWeight={"500"}
              color={COLORS.color_868686}
              //  numberOfLines={1}
              // includeFontPadding={false}
              marginLeft={5}
            />
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            //justifyContent: 'space-between',
            // alignItems: "center",
            //position: 'absolute',
            //bottom: hp(9),
            //  marginStart: 5,
            marginTop: 5,
          }}
        >
          {userData.instagram_count != null &&
            userData.instagram_count != "0" &&
            userData.instagram_count != 0 &&
            userData.instagram_count != undefined
            ? socialViewCommon(
              require("../assets/instagram.png"),
              userData.instagram_count != undefined &&
                userData.instagram_count != null
                ? userData.instagram_count
                : "0",
              () => {
                Linking.openURL(
                  userData.instagram_username != undefined &&
                    userData.instagram_username != null
                    ? "https://www.instagram.com/" +
                    userData.instagram_username
                    : "https://www.instagram.com/"
                );
              },
              "insta"
            )
            : null}
          {userData.youtube_count != null &&
            userData.youtube_count != "0" &&
            userData.youtube_count != 0 &&
            userData.youtube_count != undefined
            ? socialViewCommon(
              require("../assets/youtube.png"),
              userData.youtube_count != undefined &&
                userData.youtube_count != null
                ? userData.youtube_count
                : "0",
              () => {
                Linking.openURL(
                  userData.youtube_username != undefined &&
                    userData.youtube_username != null
                    ? //  'https://www.youtube.com/watch?v=' + userData.youtube_username
                    "https://www.youtube.com/@" +
                    userData.youtube_username
                      ?.replace(/\s+/g, "")
                      .toLowerCase()
                    : "https://www.youtube.com"
                );
              },
              "youtube"
            )
            : null}
          {/* {socialViewCommon(
            require('../assets/twitter.png'),
            userData.twitter_count != undefined &&
              userData.twitter_count != null
              ? userData.twitter_count
              : '2.5M',
            () => {
              Linking.openURL('https://twitter.com/@narendramodi');
            }
          )} */}
        </View>

        {userData.city != undefined &&
          userData.city != "" &&
          userData.city != null ? (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
                marginRight: 2,
                // tintColor: COLORS.gry_text,
              }}
              source={require("../assets/pin.png")}
              resizeMode={"contain"}
            />
            <TextCommonMedium
              text={
                userData?.city != undefined
                  ? userData?.city?.city + ", " + userData?.country?.name
                  : ""
              }
              fontSize={FONTS_SIZE.txt_13}
              fontWeight={"500"}
              color={COLORS.color_868686}
              numberOfLines={1}
              includeFontPadding={false}
              marginLeft={2}
            />
          </View>
        ) : null}

        {userData.registrationcategory != undefined &&
          userData.registrationcategory != "" &&
          userData.registrationcategory != null &&
          userData.user_type === "2" ? (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
            }}
          >
            <Image
              style={{
                width: 15,
                height: 15,
                marginRight: 7,
                marginTop: 2,
                // tintColor: COLORS.gry_text,
              }}
              source={require("../assets/category.png")}
              resizeMode={"contain"}
            />
            <TextCommonMedium
              text={
                userData.registrationcategory != undefined
                  ? userData.registrationcategory
                    .map((category) => category?.category?.category_name)
                    .join("," + " ")
                  : ""
              }
              fontSize={FONTS_SIZE.txt_13}
              // fontWeight={"200"}
              color={COLORS.color_868686}
            />
          </View>
        ) : null}



        {/* <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            marginLeft: 15,
            marginTop: 7,
          }}
        >
          <Image
            style={{
              width: 18,
              height: 18,
              tintColor: COLORS.gry_text,
            }}
            source={require('../assets/pin.png')}
            resizeMode={'contain'}
          />
          <TextCommonMedium
            text={'India'}
            fontSize={FONTS_SIZE.txt_13}
            fontWeight={'500'}
            color={COLORS.color_868686}
            numberOfLines={1}
            includeFontPadding={false}
            marginLeft={5}
          />
        </View> */}

        {/* {userData.company_name != undefined &&
          userData.company_name != '' &&
          userData.company_name != null ? (
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              marginLeft: 15,
              marginTop: 7,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.gry_text,
              }}
              source={require('../assets/ic_profile_business_address.png')}
              resizeMode={'contain'}
            />
            <TextCommonMedium
              text={
                userData.company_name != undefined ? userData.company_name : ''
              }
              fontSize={FONTS_SIZE.txt_13}
              fontWeight={'500'}
              color={COLORS.color_868686}
              numberOfLines={1}
              includeFontPadding={false}
              marginLeft={5}
            />
          </View>
        ) : null} */}

        {/* <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            marginLeft: 15,
            marginTop: 7,
          }}
        >
          <Image
            style={{
              width: 17,
              height: 17,
              tintColor: COLORS.gry_text,
            }}
            source={require('../assets/avatar.png')}
            resizeMode={'contain'}
          />
          <TextCommonMedium
            text={userData.gender == 0 ? 'Male' : 'Female'}
            fontSize={FONTS_SIZE.txt_13}
            fontWeight={'500'}
            color={COLORS.color_868686}
            numberOfLines={1}
            includeFontPadding={false}
            marginLeft={5}
          />
        </View> */}

        {/* {userData.website_url != undefined &&
          userData.website_url != '' &&
          userData.website_url != null ? (
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              marginLeft: 15,
              marginTop: 7,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.gry_text,
              }}
              source={require('../assets/web_icon.png')}
              resizeMode={'contain'}
            />
            <TextCommonMedium
              text={
                userData.website_url != undefined ? userData.website_url : ''
              }
              fontSize={FONTS_SIZE.txt_13}
              fontWeight={'500'}
              color={COLORS.color_868686}
              numberOfLines={1}
              includeFontPadding={false}
              marginLeft={5}
            />
          </View>
        ) : null} */}

        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            marginLeft: 15,
            marginRight: 10,
            marginTop: 15,
          }}
        >
          <TextCommonregular
            text={
              userData.about != undefined && userData.about != null
                ? userData.about
                : ""
            }
            fontSize={FONTS_SIZE.txt_14}
            // fontWeight={"200"}
            color={COLORS.color_868686}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              flexWrap: "wrap",
              flexDirection: "row",
              marginStart: 5,
              marginEnd: 3,
              marginTop: 10,
            }}
          >
            {userData != undefined &&
              userData.regihashtag != null &&
              userData.regihashtag.length > 0
              ? userData.regihashtag.map((item, index) => {
                return (
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: COLORS.gry_text,
                      borderRadius: 20,
                      paddingStart: 10,
                      paddingEnd: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      margin: 5,
                      backgroundColor: COLORS.very_light_grey,
                      // width: 180,
                    }}
                  >
                    <TextCommonregular
                      text={
                        item.hashtag != undefined && item.hashtag != null
                          ? "#" + item.hashtag
                          : ""
                      }
                      fontSize={FONTS_SIZE.txt_13}
                      // fontWeight={"200"}
                      color={COLORS.black_txt}
                    />
                  </View>
                );
              })
              : null}
          </View>
        </ScrollView>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setAbout(true);
    setMedia(false);
    setDescription(false);

    setTimeout(() => {
      // Add new items or update the data
      getData(true)
      setRefreshing(false);
    }, 2000); // Adjust the delay as needed
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_original,
        // justifyContent: "center",
        //alignItems: "center",
        // paddingTop: 50
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            // flex: 1,
            backgroundColor: COLORS.white_original,
            paddingBottom: 5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: 300,
              justifyContent: "center",
              alignItems: "center",

              //position: "absolute",
              // bottom: 0
            }}
          >
            {advertisementBannerList.length > 0 ? (
              <Carousel
                loop={advertisementBannerList.length > 1}
                style={{ width: wp(100), height: 305 }}
                width={wp(100)}
                height={305}
                autoplay={advertisementBannerList.length > 1}
                autoplayInterval={3000}
                data={advertisementBannerList}
                renderItem={({ item, index }) => _renderItem({ item, index })}
              />
            ) : (
              <View
                style={{
                  width: wp(100),
                  height: wp(80),
                  backgroundColor: COLORS.img_backcolor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{
                    width: 100,
                    height: 100,
                    tintColor: COLORS.placehld_txtcolor,
                  }}
                  source={require("../assets/gallery_icon.png")}
                />
              </View>
            )}

            <View
              style={{
                // alignContent: 'center',
                position: "absolute",
                bottom: 6,
                left: 5,
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                // backgroundColor: COLORS.bg_color,
                // borderRadius: 20,
                // paddingStart: 7,
                // paddingEnd: 10,
                // paddingTop: 4,
                // paddingBottom: 4,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignSelf: "center",
                  height: 75,
                  width: 75,
                  borderRadius: 75 / 2,
                  borderWidth: 1.5,
                  borderColor: COLORS.light_pink,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    height: 70,
                    width: 70,
                    borderRadius: 70 / 2,
                  }}
                >
                  <FastImage
                    style={{
                      height: 70,
                      width: 70,
                      borderRadius: 70 / 2,
                    }}
                    source={
                      userData != "" &&
                        userData != null &&
                        userData != undefined &&
                        userData.image != null &&
                        userData.image != undefined
                        ? {
                          uri: IMG_BASE_URL + userData.image,
                          priority: FastImage.priority.high,
                        }
                        : require("../assets/user_pro.png")
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  // alignContent: 'center',

                  backgroundColor: COLORS.bg_color,
                  borderRadius: 20,
                  paddingStart: 7,
                  paddingEnd: 10,
                  paddingTop: 4,
                  paddingBottom: 4,
                  marginEnd: 10,
                  alignSelf: "flex-end",
                }}
              >
                <TextCommonSemiBlod
                  text={
                    userData.fullname != undefined && userData.fullname != null
                      ? userData.fullname
                      : "My Profile Name"
                  }
                  fontSize={FONTS_SIZE.txt_13}
                  fontWeight={"500"}
                  color={COLORS.black_txt}
                  numberOfLines={1}
                  includeFontPadding={false}
                  marginLeft={5}
                />
              </View>
            </View>
          </View>

          <View style={{}}>
            <View
              style={{
                backgroundColor: COLORS.white_txt,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TabView
                // icon={require('../assets/weekly_icon.png')}
                txt={"Bio"}
                onPress={() => {
                  setMedia(false);
                  setAbout(true);
                  setDescription(false);
                }}
                visible={about}
                borderBottomColor={
                  about === true ? COLORS.primary : COLORS.white_txt
                }
                tintColor={about === true ? COLORS.primary : COLORS.gry_text}
                txtColor={about === true ? COLORS.primary : COLORS.gry_text}
              // tabBgColor={
              //   about === true ? COLORS.very_light_grey : COLORS.white_txt
              // }
              />

              <TabView
                // icon={require('../assets/monthly_icon.png')}
                txt={"Media"}
                onPress={() => {
                  setMedia(true);
                  setAbout(false);
                  setDescription(false);
                }}
                borderBottomColor={
                  media === true ? COLORS.primary : COLORS.white_txt
                }
                visible={media}
                tintColor={media === true ? COLORS.primary : COLORS.gry_text}
                txtColor={media === true ? COLORS.primary : COLORS.gry_text}
              // tabBgColor={
              //   media === true ? COLORS.very_light_grey : COLORS.white_txt
              // }
              />

              {/* <TabView
                //icon={require('../assets/tenure_icon.png')}
                txt={"Reviews"}
                onPress={() => {
                  setMedia(false);
                  setAbout(false);
                  setDescription(true);
                }}
                visible={description}
                borderBottomColor={
                  description === true ? COLORS.primary : COLORS.white_txt
                }
                tintColor={
                  description === true ? COLORS.primary : COLORS.gry_text
                }
                txtColor={
                  description === true ? COLORS.primary : COLORS.gry_text
                }
              // tabBgColor={
              //   description === true
              //     ? COLORS.very_light_grey
              //     : COLORS.white_txt
              // }
              /> */}
            </View>

            {about === true ? AboutView("About") : null}
            {/* {description === true ? DescriptionView("Description") : null} */}
            {media === true ? MediaView("Media") : null}
          </View>
        </View>
      </ScrollView>
      {isLoading == true && <Loader loading={isLoading} />}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          top: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 32),
          left: 15,
          width: "93%",
          height: StatusBarHeight + 25,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openControlPanel()}
          style={{
            width: 35,
            height: 35,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
            backgroundColor: COLORS.color_transparent_black,
            // elevation: 15,
          }}
        >
          <Image
            style={{ width: 22, height: 22, tintColor: COLORS.white_original }}
            resizeMode={"contain"}
            source={require("../assets/menu_icon.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={async () => {
            var type = await AsyncStorage.getItem("user_type");
            if (type === "1") {
              navigation.navigate("UserEditProfilePage");
            } else {
              navigation.navigate("EditProfilePage");
            }
          }}
          style={{
            width: 35,
            height: 35,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
            backgroundColor: COLORS.color_transparent_black,
            // elevation: 15,
          }}
        >
          <Image
            style={{ width: 22, height: 22, tintColor: COLORS.white_original }}
            resizeMode={"contain"}
            source={require("../assets/edit-info.png")}
          />
        </TouchableOpacity>
      </View>

      <LogoutDialog
        loading={connectDialogVisible}
        msg_title={"Alert!"}
        msg_text={"Do you really want to connect ?"}
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          setconnectDialogVisible(false);
          try {
            // navigation.replace("LoginPage");
          } catch (e) { }
        }}
        onPressLeftButton={() => setconnectDialogVisible(false)}
      />
      <LogoutDialog
        loading={isReportVisible}
        msg_text={"Are you sure you want to report this user?"}
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          setIsReportVisible(false);
          onReportClick();
        }}
        onPressLeftButton={() => setIsReportVisible(false)}
      />

      <LogoutDialog
        loading={isLoginVisible}
        msg_text={"Are you sure you want to " + "Block" + " this user?"}
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          setIsLoginVisible(false);
          onBlockClick();
        }}
        onPressLeftButton={() => setIsLoginVisible(false)}
      />

      <DialogMoreOptionsOtherProfile
        item={"itemPass"}
        user_id={{}}
        title_block={"Block"}
        title_report={"Report"}
        reportClick={() => {
          onReportClickView();
        }}
        cancelClick={() => toggleModal()}
        isDialogVisible={isDialogVisible}
        toggleModalClick={() => toggleModal()}
        BlockClick={() => {
          toggleModal();
          setIsLoginVisible(true);
        }}
      />
    </View>
  );
}

export default UserProfilePage;
