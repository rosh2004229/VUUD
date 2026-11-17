import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import APIWebCall from "./APIWebCall";
import InternetPermission from "./InternetPermission";
import Loader from "./LoadingScreen";
import LogoutDialog from "./LogoutDialog";
import SnackBarCommon from "./SnackBarCommon";
import TextCommonMedium from "./TextCommonMedium";
import TextCommonSemiBlod from "./TextCommonSemiBlod";
import { COLORS, FONTS_SIZE, IMG_BASE_URL, activeOpacity } from "./utils";
import TextCommonregular from "./TextCommonregular";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import { useIsFocused } from "@react-navigation/native";
import useAsyncStorageCommon from '../../src/common/AsyncStorageCommon';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


function CustomSidebarMenu(props) {
  const insets = useSafeAreaInsets();
  const topDrawerSpacing = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20) + 15;
  const bottomDrawerSpacing = Math.max(insets.bottom, 16) + 30;
  const navigation = useNavigation();
  const [deleteModelVisible, setDeleteModelVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [influencerType, setInfluencerType] = useState("");
  const [profile_pic, setProfilePic] = useState(null);
  const [userData, setUserData] = useState({});
  const [requestCount, setRequestCount] = useState(0);
  const isFocused = useIsFocused();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setFullName("");
  //     setEmail("");
  //     setInfluencerType("");
  //     setProfilePic(null);
  //     getData();
  //   }, [])
  // );

  const { item: itemNotiCount } = useAsyncStorageCommon('noti_count');

  useEffect(() => {
    removeState()
    getData();
    // navigation.addListener('focus', () => {
    //   removeState()
    //   getData();
    // });
  }, [1000, itemNotiCount]);
  const removeState = () => {
    setFullName("");
    setEmail("");
    setInfluencerType("");
    setProfilePic(null);
  }

  const getData = async () => {
    var user_id = await AsyncStorage.getItem("user_id");
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    var data = new FormData();
    data.append("user_id", user_id);
    if (isInternetGranted == true) {
      setisLoading(true);
      onGetAllProfileDataAPICall(data);
      var res = await APIWebCall.getRequestCountAPI(data);
      if (res?.data?.getrequestcount) {
        setRequestCount(res?.data?.getrequestcount);
      } else {
        setRequestCount(0);
      }
    }
  };

  const onGetAllProfileDataAPICall = (data) => {
    APIWebCall.onGetUserAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        // console.log("userData=--------------------------->", userData)
        setUserData(response.data.user);
        if (
          response.data.user.fullname != null &&
          response.data.user.fullname != undefined
        ) {
          setFullName(response.data.user.fullname);
        }
        if (
          response.data.user.email != null &&
          response.data.user.email != undefined
        ) {
          setEmail(response.data.user.email);
        }
        if (
          response.data.user.influencer_type != null &&
          response.data.user.influencer_type != undefined
        ) {
          setInfluencerType(response.data.user.influencer_type);
        }
        if (
          response.data.user.image != null &&
          response.data.user.image != undefined
        ) {
          setProfilePic(response.data.user.image);
        }
      })
      .catch((err) => {
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const onDrawerItemClick = (screenName, parm) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(screenName, parm);
  };

  const onLogoutClick = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out ?",
      [
        {
          text: "Yes",
          onPress: () => {
            LogoutClick();
          },
        },
        {
          text: "No",
          onPress: () => {
            // navigation.navigate('SettingPage');
          },
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const LogoutClick = () => {
    try {
      props.navigation.replace("LoginPage");
    } catch (e) { }
  };

  const onDeleteAccountApiCall = async () => {
    var user_id = await AsyncStorage.getItem("user_id_save");
    if (user_id != null && user_id != undefined) {
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();

      if (isInternetGranted == true) {
        var data = new FormData();
        data.append("id", user_id);
        onDeleteAccountAPICall(data);
      }
    }
  };

  const onDeleteAccountAPICall = () => {
    APIWebCall.onDeleteAccountAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        setDeleteModelVisible(false);
        AsyncStorage.clear();
        props.navigation.replace("LoginPage");
        setTimeout(() => {
          SnackBarCommon({ text: response.message, isSuccess: true });
        }, 120);
      })
      .catch((err) => {
        setisLoading(false);
        setDeleteModelVisible(false);
        if (err.response.data.message != undefined) {
          setTimeout(() => {
            SnackBarCommon({ text: err.response.data.message });
          }, 120);
        }
      })
      .finally(() => setisLoading(false));
  };

  const onCommonLeftView = (icon, txt, onClick) => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onClick}>
        <View
          style={{
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
              marginRight: 20,
              marginTop: 8,
            }}
          >
            <Image
              style={{
                height: 22,
                width: 22,
                tintColor:
                  txt === "Delete Account"
                    ? COLORS.color_red
                    : //: COLORS.black_txt,
                    "#562347",
              }}
              source={icon}
              resizeMode={"contain"}
            />

            <TextCommonSemiBlod
              text={txt}
              color={txt === "Delete Account" ? COLORS.color_red : "#562347"}
              fontSize={FONTS_SIZE.txt_14}
              fontWeight={"500"}
              marginLeft={10}
              marginTop={3}
            />
            {txt === "Requests"
              ? requestCount > 0
                ? roundViewCountView()
                : null
              : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const roundViewCountView = () => {
    return (
      <View
        style={{
          width: 24,
          height: 24,
          marginLeft: 8,
          marginBottom: 2,
          backgroundColor: COLORS.primary,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 24 / 2,
        }}
      >
        <TextCommonSemiBlod
          text={requestCount}
          color={COLORS.white_txt}
          fontSize={FONTS_SIZE.txt_11}
          fontWeight={"400"}
          marginTop={2}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        //opacity: 1,
        width: "100%",
      }}
    >
      <ImageBackground
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode={"cover"}
        source={require("../assets/drawer_bg.jpg")}
      >
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: topDrawerSpacing,
            paddingBottom: bottomDrawerSpacing,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("UserProfilePage")}
            activeOpacity={activeOpacity}
            style={
              {
                // backgroundColor: '#F2E9E2',
              }
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 15,
                paddingBottom: 15,
                paddingLeft: 10,
                marginStart: 15,
                marginEnd: 15,
                backgroundColor: COLORS.white_original,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.light_pink,
                  borderRadius: 50,
                  overflow: "hidden",
                }}
              >
                {profile_pic != null && profile_pic != undefined ? (
                  // <Image
                  //   style={{
                  //     width: 60,
                  //     height: 60,
                  //     borderRadius: 3,
                  //   }}
                  //   resizeMode={'cover'}
                  //   source={{ uri: IMG_BASE_URL + profile_pic }}
                  // />

                  <FastImage
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                    }}
                    source={{
                      uri: IMG_BASE_URL + profile_pic,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <Image
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 3,
                    }}
                    resizeMode={"cover"}
                    source={require("../assets/user_pro.png")}
                  />
                )}
              </View>

              <View
                style={{
                  marginLeft: 10,
                  paddingRight: 5,
                  width: wp(52),
                }}
              >
                <TextCommonSemiBlod
                  text={full_name}
                  color={COLORS.black_txt}
                  fontSize={FONTS_SIZE.txt_15}
                  fontWeight={"500"}
                  numberOfLines={1}
                />
                {userData != undefined && userData.user_type === "1" ? (
                  <TextCommonregular
                    text={email}
                    color={COLORS.gry_text}
                    fontSize={FONTS_SIZE.txt_13}
                    fontWeight={"500"}
                    numberOfLines={1}
                  />
                ) : (
                  <TextCommonMedium
                    text={
                      influencerType != null && influencerType != undefined
                        ? influencerType + " " + "Influencer"
                        : ""
                    }
                    color={COLORS.gry_text}
                    fontSize={FONTS_SIZE.txt_13}
                    fontWeight={"500"}
                    numberOfLines={1}
                  />
                )}
              </View>
            </View>
            {/* <View
            style={{
              height: 0.5,
              backgroundColor: COLORS.gry_light,
              marginTop: 30,
            }}
          /> */}
          </TouchableOpacity>

          {userData != undefined && userData.user_type === "1" ? (
            <View style={{ marginTop: 20 }}>
              {onCommonLeftView(
                require("../assets/my_request.png"),
                "My Requests",
                () => {
                  onDrawerItemClick("MyRequestPage");
                }
              )}
            </View>
          ) : (
            <View style={{ marginTop: 20 }}>
              {onCommonLeftView(
                require("../assets/request.png"),
                "Requests",
                () => {
                  onDrawerItemClick("RequestsPage");
                  setRequestCount(0)
                }
              )}
              {onCommonLeftView(
                require("../assets/my_request.png"),
                "My Requests",
                () => {
                  onDrawerItemClick("MyRequestPage")

                }
              )}

              {/* {onCommonLeftView(
              require('../assets/insurance.png'),
              'Privacy & Policy',
              () => {
                onDrawerItemClick('PACPage', { text: 'Privacy & Policy' });
              }
            )}
            {onCommonLeftView(require('../assets/info.png'), 'About Us', () => {
              onDrawerItemClick('PACPage', { text: 'About Us' });
            })}
            {onCommonLeftView(
              require('../assets/call.png'),
              'Contact Us',
              () => {
                onDrawerItemClick('PACPage', { text: 'Contact Us' });
              }
            )}
            {onCommonLeftView(
              require('../assets/logout.png'),
              'Log Out',
              () => {
                setIsLoginVisible(true);
              }
            )}
            {onCommonLeftView(
              require('../assets/remove_user.png'),
              'Delete Account',
              () => {
                setDeleteModelVisible(true);
              }
            )} */}
            </View>
          )}

          {/* <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 6,
              paddingBottom: 6,
              // paddingLeft: 10,
              // marginStart: 10,
              // marginEnd: 10,
              backgroundColor: COLORS.white_original,
              // borderRadius: 5,
            }}
          >

            <View
              style={{
                marginLeft: 25,
                paddingRight: 5,
                width: wp(52),
              }}
            >
              <TextCommonMedium
                text={"Type of Influencers"}
                color={COLORS.black_txt}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={'500'}
                numberOfLines={1}
              />

            </View>
          </View> */}

          <View
            style={{
              width: "90%",
              height: wp(0.2),
              marginLeft: 20,
              marginRight: 15,
              marginTop: 20,
              // marginBottom: 10,
              backgroundColor: COLORS.gry_text,
            }}
          />

          <View style={{ marginTop: 10 }}>
            {onCommonLeftView(
              require("../assets/nano_influencer.png"),
              "Nano Influencers",
              () => {
                props.navigation.navigate("InfluencerListPage", {
                  type_name: "Nano",
                  category_id: null,
                });
              }
            )}

            {onCommonLeftView(
              require("../assets/micro_influencer.png"),
              "Micro Influencers",
              () => {
                props.navigation.navigate("InfluencerListPage", {
                  type_name: "Micro",
                  category_id: null,
                });
              }
            )}

            {onCommonLeftView(
              require("../assets/macro_influencer.png"),
              "Macro Influencers",
              () => {
                props.navigation.navigate("InfluencerListPage", {
                  type_name: "Macro",
                  category_id: null,
                });
              }
            )}

            {onCommonLeftView(
              require("../assets/mega_influencer.png"),
              "Mega Influencers",
              () => {
                props.navigation.navigate("InfluencerListPage", {
                  type_name: "Mega",
                  category_id: null,
                });
              }
            )}

            <View
              style={{
                width: "90%",
                height: wp(0.2),
                marginLeft: 20,
                marginRight: 15,
                marginTop: 20,
                marginBottom: 10,
                backgroundColor: COLORS.gry_text,
              }}
            />

            {/* {onCommonLeftView(
              require("../assets/subscribe.png"),
              "Subscriptions",
              () => {
                onDrawerItemClick("SubscriptionsPage");
                // alert('comming soon');
              }
            )}
             */}
            {onCommonLeftView(
              require("../assets/setting.png"),
              "Settings",
              () => {
                onDrawerItemClick("SettingPage");
              }
            )}
          </View>
        </ScrollView>
        </SafeAreaView>
      </ImageBackground>
      <LogoutDialog
        loading={deleteModelVisible}
        msg_title={"Delete Account!"}
        msg_text={"Are you sure you want to delete account?"}
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          onDeleteAccountApiCall();
        }}
        onPressLeftButton={() => setDeleteModelVisible(false)}
      />

      <LogoutDialog
        loading={isLoginVisible}
        msg_title={"Logout Account!"}
        msg_text={"Do you really want to logout ?"}
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          setIsLoginVisible(false);
          try {
            AsyncStorage.clear();

            props.navigation.dispatch(StackActions.replace("LoginPage"));
          } catch (e) {
            console.log(e);
          }
        }}
        onPressLeftButton={() => setIsLoginVisible(false)}
      />
    </View>
  );
}

export default CustomSidebarMenu;
