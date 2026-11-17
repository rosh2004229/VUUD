import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl
} from "react-native";
import { COLORS, FONTS_SIZE, analyticsLog, kFormatter } from "../common/utils";
import InternetPermission from "../common/InternetPermission";
import Header from "../common/Header";
import axios from "axios";
import Loader from "../common/LoadingScreen";
import APIWebCall from "../common/APIWebCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnackBarCommon from "../common/SnackBarCommon";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/routers";
import ItemExploreInfuencerList from "../ItemView/ItemExploreInfuencerList";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import ItemInfluencerCategory from "../ItemView/ItemInfluencerCategory";
import PushNotifications from "../common/PushNotifications";
import { Platform } from "react-native";
import LogoutDialog from "../common/LogoutDialog";
import { Linking } from "react-native";
import DeviceInfo from "react-native-device-info";
import DialogForcefullyDetails from "../common/DialogForcefullyDetails";
import VersionUpdateDialog from "../common/VersionUpdateDialog";

function ExplorePage({ }) {
  const navigation = useNavigation();

  const [isLoading, setisLoading] = useState(false);
  const [influencerArr, setInfluencerArr] = useState([]);
  const [nanoInfluencerArr, setNanoInfluencerArr] = useState([]);
  const [microInfluencer, setMicroInfluencer] = useState([]);
  const [macroInfluencer, setMacroInfluencer] = useState([]);
  const [megaInfluencer, setMegaInfluencer] = useState([]);
  const [trendingInfluencer, setTrendingInfluencer] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isForcefullyDialogVisible, setForcefullyDialogVisible] =
    useState(false);
  const [android_description, setAndroidDescription] = useState();
  const [refreshing, setRefreshing] = useState(false);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // getData();
  //   }, [])
  // );

  useEffect(() => {
    getData(false);
  }, [])

  const openControlPanel = () => {
    try {
      if (navigation && typeof navigation.openDrawer === "function") {
        navigation.openDrawer();
      } else if (DrawerActions && typeof DrawerActions.openDrawer === "function") {
        navigation.dispatch(DrawerActions.openDrawer());
      }
    } catch (e) {
      console.warn("openControlPanel error:", e);
    }
  };

  const getData = async (pullRefresh) => {
    try {
      await analyticsLog("Explore_screen");
    } catch (e) {
      console.warn("analyticsLog error:", e);
    }
    try {
      await versionApi();
    } catch (e) {
      console.warn("versionApi error:", e);
    }
    try {
      await influencerListAPI(pullRefresh);
    } catch (e) {
      console.warn("influencerListAPI error:", e);
    }
    try {
      await influencerCategoryListAPICall(pullRefresh);
    } catch (e) {
      console.warn("influencerCategoryListAPICall error:", e);
    }
    try {
      await AsyncStorage.removeItem('city_id_edit');
      await AsyncStorage.removeItem('city_edit');
    } catch (e) {
      console.warn("AsyncStorage error:", e);
    }
  };

  const getAllProfileData = async () => {
    try {
      var user_id = await AsyncStorage.getItem("user_id");
      var isInternetGranted = await InternetPermission.checkInternetPermissions();

      if (isInternetGranted == true) {
        setisLoading(true);
        var data = new FormData();
        data.append("user_id", user_id);

        onGetAllProfileDataAPICall(data);
      }
    } catch (e) {
      setisLoading(false);
      console.warn("getAllProfileData error:", e);
    }
  };
  const onGetAllProfileDataAPICall = (data) => {
    APIWebCall.onGetUserAPICall(data, navigation)
      .then(async (response) => {
        setisLoading(false);

        // setUserData(response.data.user);

        // console.log(
        //   'response.data.user ==> ',
        //   JSON.stringify(response.data.user)
        // );

        if (
          response?.data?.user?.about != undefined &&
          response?.data?.user?.about != null &&
          response?.data?.user?.about != "" &&
          response?.data?.user?.city_id != undefined &&
          response?.data?.user?.city_id != null &&
          response?.data?.user?.city_id != "" &&
          response?.data?.user?.image != undefined &&
          response?.data?.user?.image != null &&
          response?.data?.user?.image != "" &&
          response?.data?.user?.profile_image != undefined &&
          response?.data?.user?.profile_image != null &&
          response?.data?.user?.profile_image.length > 0 &&
          response?.data?.user?.regihashtag != undefined &&
          response?.data?.user?.regihashtag != null &&
          response?.data?.user?.regihashtag.length > 0
        ) {
          setForcefullyDialogVisible(false);
        } else {
          if (isLoginVisible === false) {
            setForcefullyDialogVisible(true);
          }
        }
      })
      .catch((err) => {
        setisLoading(false);
        const errorMsg =
          err?.message ||
          (typeof err === "string" ? err : null) ||
          err?.error ||
          "Something went wrong, Please try again later";
        SnackBarCommon({ text: errorMsg });
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const versionApi = async () => {
    try {
      let isInternetGranted = await InternetPermission.checkInternetPermissions();
      if (isInternetGranted == true) {
        APIWebCall.onVersionCheckAPICall()
          .then(async (response) => {
            if (
              response?.data?.versioncheck?.status != undefined &&
              response?.data?.versioncheck?.status != null
            ) {
              // setIsLoginVisible(true);

              if (response.data.versioncheck.status.toString() === "0") {
                const getSystemVersion =
                  DeviceInfo && typeof DeviceInfo.getVersion === "function"
                    ? DeviceInfo.getVersion()
                    : "";

                if (Platform.OS === "ios") {
                  setAndroidDescription(
                    response.data.versioncheck.ios_description
                  );
                  if (
                    getSystemVersion &&
                    response.data.versioncheck.ios &&
                    getSystemVersion.toString() !=
                      response.data.versioncheck.ios.toString()
                  ) {
                    setIsLoginVisible(true);
                  }
                } else {
                  setAndroidDescription(
                    response.data.versioncheck.android_description
                  );
                  if (
                    getSystemVersion &&
                    response.data.versioncheck.android &&
                    getSystemVersion.toString() !=
                      response.data.versioncheck.android.toString()
                  ) {
                    setIsLoginVisible(true);
                  }
                }
              }
            }
          })
          .catch((err) => {
            console.warn("Version check error:", err);
          })
          .finally(() => { });
      }
    } catch (e) {
      console.warn("versionApi error:", e);
    }
  };

  const influencerListAPI = async (pullRefresh) => {
    try {
      var isInternetGranted = await InternetPermission.checkInternetPermissions();

      if (isInternetGranted == true) {
        await onInfluencerListAPICall(pullRefresh);
      }
    } catch (e) {
      console.warn("influencerListAPI error:", e);
    }
  };

  const onInfluencerListAPICall = async (pullRefresh) => {
    if (pullRefresh === false) {
      setisLoading(true);
    }
    return APIWebCall.onInfluencerListAPICall()
      .then(async (response) => {
        setisLoading(false);

        if (response?.data?.user != undefined && response?.data?.user != null) {
          setInfluencerArr(response.data.user);
        }
        if (
          response?.data?.nano_influencer != undefined &&
          response?.data?.nano_influencer != null
        ) {
          setNanoInfluencerArr(response.data.nano_influencer);
        }

        if (
          response?.data?.micro_influencer != undefined &&
          response?.data?.micro_influencer != null
        ) {
          setMicroInfluencer(response.data.micro_influencer);
        }
        if (
          response?.data?.macro_influencer != undefined &&
          response?.data?.macro_influencer != null
        ) {
          setMacroInfluencer(response.data.macro_influencer);
        }
        if (
          response?.data?.mega_influencer != undefined &&
          response?.data?.mega_influencer != null
        ) {
          setMegaInfluencer(response.data.mega_influencer);
        }
        if (
          response?.data?.trending_influencer != undefined &&
          response?.data?.trending_influencer != null
        ) {
          setTrendingInfluencer(response.data.trending_influencer);
        }
      })
      .catch((err) => {
        setisLoading(false);
        const errorMsg =
          err?.message ||
          (typeof err === "string" ? err : null) ||
          err?.error ||
          "Something went wrong, Please try again later";
        setTimeout(() => {
          SnackBarCommon({ text: errorMsg });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const influencerCategoryListAPICall = async (pullRefresh) => {
    try {
      var isInternetGranted = await InternetPermission.checkInternetPermissions();

      if (isInternetGranted == true) {
        await onInfluencerCategoryListAPICall(pullRefresh);
      }
    } catch (e) {
      console.warn("influencerCategoryListAPICall error:", e);
    }
  };

  const onInfluencerCategoryListAPICall = async (pullRefresh) => {
    if (pullRefresh === false) {
      setisLoading(true);
    }
    return APIWebCall.onInfluencerCategoryListAPICall()
      .then(async (response) => {
        setisLoading(false);

        if (
          response?.data?.category != undefined &&
          response?.data?.category != null
        ) {
          setCategoryList(response.data.category);
        }
      })
      .catch((err) => {
        setisLoading(false);
        const errorMsg =
          err?.message ||
          (typeof err === "string" ? err : null) ||
          err?.error ||
          "Something went wrong, Please try again later";
        setTimeout(() => {
          SnackBarCommon({ text: errorMsg });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const onInfluencerProfileClick = async (item) => {
    try {
      if (!item || item.id == null) return;
      var user_id = await AsyncStorage.getItem("user_id");
      var user_type = await AsyncStorage.getItem("user_type");

      if (user_id === item.id.toString()) {
        navigation.navigate("UserProfilePage", {
          item: item.id,
          type: user_type,
        });
      } else {
        navigation.navigate("InfluencerProfilePage", {
          item: item.id,
          type: "1",
        });
      }
    } catch (e) {
      console.warn("onInfluencerProfileClick error:", e);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData(true)
      .catch((e) => console.warn("Refresh error:", e))
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_txt,
        //justifyContent: 'center',
        //  alignItems: 'center',
        //  paddingTop: 10
      }}
    >
      <Header
        // onProfileClick={async () => {
        //   var user_id = await AsyncStorage.getItem("user_id");
        //   var user_type = await AsyncStorage.getItem("user_type");
        //   {
        //     user_type === '2'
        //       ? navigation.navigate('InfluencerProfilePage', {
        //         item: user_id,
        //         type: user_type,
        //       })
        //       : navigation.navigate('UserProfilePage', {
        //         item: user_id,
        //         type: user_type,
        //       });
        //   }
        // }}
        backIcon={require("../assets/menu_icon.png")}
        onBackClick={() => openControlPanel()}
        btnText={"Explore"}
        onFilterClick={() => {
          navigation.navigate("FilterPage");
        }}
        filter={require("../assets/adjust.png")}
        rightIconVisible={false}
      />
      <PushNotifications navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }

      >
        {trendingInfluencer.length > 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("InfluencerListPage", {
                  type_name: "Trending",
                  category_id: null,
                });
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <TextCommonSemiBlod
                text={"Recently Added Influencers"}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={"500"}
                color={COLORS.comment_bg_color}
                numberOfLines={1}
                includeFontPadding={false}
                marginLeft={10}
              />
              <TextCommonSemiBlod
                text={"View All"}
                fontSize={FONTS_SIZE.txt_13}
                fontWeight={"500"}
                color={COLORS.primary}
                numberOfLines={1}
                includeFontPadding={false}
                marginRight={10}
              />
            </TouchableOpacity>
            <FlatList
              data={trendingInfluencer}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                padding: 5,
                paddingBottom: 8,
                marginTop: 5,
                marginLeft: 3,
              }}
              renderItem={({ item, index }) => {
                return (
                  <ItemExploreInfuencerList
                    item={item}
                    onItemClick={() => {
                      onInfluencerProfileClick(item);
                    }}
                  />
                );
              }}
              // ListEmptyComponent={() => {
              //   return isLoading === false ? (
              //     <EmptyView msgText={"No data found"} />
              //   ) : null;
              // }}
              keyExtractor={(_, index) => index.toString()}
            // onEndReachedThreshold={0.05}
            // onEndReached={fetchMoreData}
            // onRefresh={onRefresh}
            // refreshing={isRefresh}
            />
          </View>
        ) : null}
        <View>
          <TouchableOpacity
            // onPress={() => {
            //   navigation.navigate('InfluencerListPage', {
            //     type_name: 'Categories Influencers',
            //   });
            // }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <TextCommonSemiBlod
              text={"Categories"}
              fontSize={FONTS_SIZE.txt_15}
              fontWeight={"500"}
              color={COLORS.comment_bg_color}
              numberOfLines={1}
              includeFontPadding={false}
              marginLeft={10}
            />
            {/* <TextCommonSemiBlod
              text={'View All'}
              fontSize={FONTS_SIZE.txt_13}
              fontWeight={'500'}
              color={COLORS.primary}
              numberOfLines={1}
              includeFontPadding={false}
              marginRight={10}
            /> */}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              padding: 5,
              paddingBottom: 15,
              marginTop: 5,
              marginLeft: 3,
            }}
          >
            {categoryList.map((item, index) => {
              return (
                <ItemInfluencerCategory
                  key={item?.id != null ? item.id.toString() : index.toString()}
                  item={item}
                  onItemClick={() => {
                    navigation.navigate("InfluencerListPage", {
                      type_name: item.category_name,
                      category_id: item.id,
                    });
                  }}
                />
              );
            })}
          </View>
        </View>

        {nanoInfluencerArr.length > 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("InfluencerListPage", {
                  type_name: "Nano",
                  category_id: null,
                });
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TextCommonSemiBlod
                text={"Nano Influencers"}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={"500"}
                color={COLORS.comment_bg_color}
                numberOfLines={1}
                includeFontPadding={false}
                marginLeft={10}
              />
              <TextCommonSemiBlod
                text={"View All"}
                fontSize={FONTS_SIZE.txt_13}
                fontWeight={"500"}
                color={COLORS.primary}
                numberOfLines={1}
                includeFontPadding={false}
                marginRight={10}
              />
            </TouchableOpacity>
            <FlatList
              data={nanoInfluencerArr}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                padding: 5,
                paddingBottom: 8,
                marginTop: 5,
                marginLeft: 3,
              }}
              renderItem={({ item, index }) => {
                return (
                  <ItemExploreInfuencerList
                    item={item}
                    onItemClick={() => {
                      onInfluencerProfileClick(item);
                    }}
                  />
                );
              }}
              // ListEmptyComponent={() => {
              //   return isLoading === false ? (
              //     <EmptyView msgText={"No data found"} />
              //   ) : null;
              // }}
              keyExtractor={(_, index) => index.toString()}
            // onEndReachedThreshold={0.05}
            // onEndReached={fetchMoreData}
            // onRefresh={onRefresh}
            // refreshing={isRefresh}
            />
          </View>
        ) : null}

        {microInfluencer.length > 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("InfluencerListPage", {
                  type_name: "Micro",
                  category_id: null,
                });
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <TextCommonSemiBlod
                text={"Micro Influencers"}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={"500"}
                color={COLORS.comment_bg_color}
                numberOfLines={1}
                includeFontPadding={false}
                marginLeft={10}
              />
              <TextCommonSemiBlod
                text={"View All"}
                fontSize={FONTS_SIZE.txt_13}
                fontWeight={"500"}
                color={COLORS.primary}
                numberOfLines={1}
                includeFontPadding={false}
                marginRight={10}
              />
            </TouchableOpacity>
            <FlatList
              data={microInfluencer}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                padding: 5,
                paddingBottom: 8,
                marginTop: 5,
                marginLeft: 3,
              }}
              renderItem={({ item, index }) => {
                return (
                  <ItemExploreInfuencerList
                    item={item}
                    onItemClick={() => {
                      onInfluencerProfileClick(item);
                    }}
                  />
                );
              }}
              // ListEmptyComponent={() => {
              //   return isLoading === false ? (
              //     <EmptyView msgText={"No data found"} />
              //   ) : null;
              // }}
              keyExtractor={(_, index) => index.toString()}
            // onEndReachedThreshold={0.05}
            // onEndReached={fetchMoreData}
            // onRefresh={onRefresh}
            // refreshing={isRefresh}
            />
          </View>
        ) : null}

        {macroInfluencer.length > 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("InfluencerListPage", {
                  type_name: "Macro",
                  category_id: null,
                });
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <TextCommonSemiBlod
                text={"Macro Influencers"}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={"500"}
                color={COLORS.comment_bg_color}
                numberOfLines={1}
                includeFontPadding={false}
                marginLeft={10}
              />
              <TextCommonSemiBlod
                text={"View All"}
                fontSize={FONTS_SIZE.txt_13}
                fontWeight={"500"}
                color={COLORS.primary}
                numberOfLines={1}
                includeFontPadding={false}
                marginRight={10}
              />
            </TouchableOpacity>
            <FlatList
              data={macroInfluencer}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                padding: 5,
                paddingBottom: 8,
                marginTop: 5,
                marginLeft: 3,
              }}
              renderItem={({ item, index }) => {
                return (
                  <ItemExploreInfuencerList
                    item={item}
                    onItemClick={() => {
                      onInfluencerProfileClick(item);
                    }}
                  />
                );
              }}
              // ListEmptyComponent={() => {
              //   return isLoading === false ? (
              //     <EmptyView msgText={"No data found"} />
              //   ) : null;
              // }}
              keyExtractor={(_, index) => index.toString()}
            // onEndReachedThreshold={0.05}
            // onEndReached={fetchMoreData}
            // onRefresh={onRefresh}
            // refreshing={isRefresh}
            />
          </View>
        ) : null}

        {megaInfluencer.length > 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("InfluencerListPage", {
                  type_name: "Mega",
                  category_id: null,
                });
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <TextCommonSemiBlod
                text={"Mega Influencers"}
                fontSize={FONTS_SIZE.txt_15}
                fontWeight={"500"}
                color={COLORS.comment_bg_color}
                numberOfLines={1}
                includeFontPadding={false}
                marginLeft={10}
              />
              <TextCommonSemiBlod
                text={"View All"}
                fontSize={FONTS_SIZE.txt_13}
                fontWeight={"500"}
                color={COLORS.primary}
                numberOfLines={1}
                includeFontPadding={false}
                marginRight={10}
              />
            </TouchableOpacity>
            <FlatList
              data={megaInfluencer}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                padding: 5,
                paddingBottom: 8,
                marginTop: 5,
                marginLeft: 3,
              }}
              renderItem={({ item, index }) => {
                return (
                  <ItemExploreInfuencerList
                    item={item}
                    onItemClick={() => {
                      onInfluencerProfileClick(item);
                    }}
                  />
                );
              }}
              // ListEmptyComponent={() => {
              //   return isLoading === false ? (
              //     <EmptyView msgText={"No data found"} />
              //   ) : null;
              // }}
              keyExtractor={(_, index) => index.toString()}
            // onEndReachedThreshold={0.05}
            // onEndReached={fetchMoreData}
            // onRefresh={onRefresh}
            // refreshing={isRefresh}
            />
          </View>
        ) : null}
        {/* <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('InfluencerListPage', {
                type_name: 'Trending Influencers',
                category_id: null,
              });
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <TextCommonSemiBlod
              text={'Trending Influencers'}
              fontSize={FONTS_SIZE.txt_15}
              fontWeight={'500'}
              color={COLORS.comment_bg_color}
              numberOfLines={1}
              includeFontPadding={false}
              marginLeft={10}
            />
            <TextCommonSemiBlod
              text={'View All'}
              fontSize={FONTS_SIZE.txt_13}
              fontWeight={'500'}
              color={COLORS.primary}
              numberOfLines={1}
              includeFontPadding={false}
              marginRight={10}
            />
          </TouchableOpacity>
          <FlatList
            data={influencerArr}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              padding: 5,
              paddingBottom: 8,
              marginTop: 5,
              marginLeft: 3,
            }}
            renderItem={({ item, index }) => {
              return (
                <ItemExploreInfuencerList
                  item={item}
                  onItemClick={() => {
                    onInfluencerProfileClick(item);
                  }}
                />
              );
            }}
            // ListEmptyComponent={() => {
            //   return isLoading === false ? (
            //     <EmptyView msgText={"No data found"} />
            //   ) : null;
            // }}
            keyExtractor={(_, index) => index.toString()}
            // onEndReachedThreshold={0.05}
            // onEndReached={fetchMoreData}
            // onRefresh={onRefresh}
            // refreshing={isRefresh}
          />
        </View> */}
      </ScrollView>
      <Loader loading={isLoading} />

      <VersionUpdateDialog
        loading={isLoginVisible}
        iconColor={COLORS.primary}
        msg_text={
          android_description != null
            ? android_description
            : "Update is available please update"
        }
        msg_title={"Update Application"}
        rightButtonText={"Update"}
        onPressRightButton={() => {
          setIsLoginVisible(false);
          setTimeout(() => {
            if (Platform.OS === "ios") {
              Linking.openURL("");
            } else {
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.indiainfluencer.app"
              );
            }
          }, 120);
        }}
      />

      <DialogForcefullyDetails
        loading={isForcefullyDialogVisible}
        iconColor={COLORS.primary}
        msg_text={"Please update the profile data"}
        msg_title={"Update Profile"}
        rightButtonText={"Ok"}
        onPressRightButton={() => {
          setForcefullyDialogVisible(false);
          navigation.navigate("EditProfilePage");
        }}
      />
    </View>
  );
}

export default ExplorePage;
