import React, { useEffect, useState } from "react";
import { FlatList, Image, TextInput, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ItemNotificationList from "../ItemView/ItemNotificationList";
import ToolbarBackButton from "../common/ToolbarBackButton";
import {
  COLORS,
  FONTS,
  FONTS_SIZE,
  IMG_BASE_URL,
  analyticsLog,
  elevation,
} from "../common/utils";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import Loader from "../common/LoadingScreen";
import SnackBarCommon from "../common/SnackBarCommon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutDialog from "../common/LogoutDialog";
import EmptyView from "../common/EmptyView";
import ToolbarHeaderText from "../common/ToolbarHeaderText";
import Header from "../common/Header";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/routers";
import ItemMessageUserProfileList from "../ItemView/ItemMessageUserProfileList";
import { RefreshControl } from "react-native";

const MessageUsersListPage = ({ navigation, route }) => {
  const [chatListArray, setChatListArray] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInfluencer, setSearchValue] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    setChatListArray([]);
    analyticsLog("Message_screen");
    getData("", false);
  }, [])

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setChatListArray([]);
  //     analyticsLog("Message_screen");
  //     getData("");
  //   }, [])
  // );

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

  const getData = async (searchValue, pullRefresh) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    var user_id = await AsyncStorage.getItem("user_id");

    if (isInternetGranted == true) {
      if (searchValue === "") {
        if (pullRefresh === false) {
          setisLoading(true);
        }
      }
      var data = new FormData();
      data.append("user_id", user_id);
      data.append("search", searchValue);
      onChatListAPICall(data);
    }
  };

  const onChatListAPICall = async (data) => {
    APIWebCall.onChatListAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        if (response.data.user != undefined && response.data.user != null)
          setChatListArray(response.data.user);
      })
      .catch((err) => {
        setisLoading(false);
        setTimeout(() => {
          SnackBarCommon({ text: err.message });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const searchFilterFunction = (searchText) => {
    setSearchValue(searchText);
    if (searchText != "") {
      getData(searchText, true);
    } else {
      getData("", false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchValue('');
    setChatListArray([]);
    // Simulate a network request
    setTimeout(() => {
      // Add new items or update the data
      getData("", true);
      setRefreshing(false);
    }, 2000); // Adjust the delay as needed
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_txt,
      }}
    >
      <Header
        btnText={"Message"}
        backIcon={require("../assets/menu_icon.png")}
        onBackClick={() => openControlPanel()}
        rightIconVisible={true}
        filter={require("../assets/search_icon.png")}
        onFilterClick={() => setSearchVisible(!searchVisible)}
      />

      {searchVisible === true ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 50,
            backgroundColor: COLORS.white_original,
            marginTop: 8,
            borderRadius: 5,
            padding: 10,
            elevation: elevation,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <View style={{ marginLeft: 5 }}>
            <Image
              style={{ height: 18, width: 18, tintColor: COLORS.black_txt }}
              resizeMode="contain"
              source={require("../assets/search_icon.png")}
            />
          </View>
          <View
            style={{
              marginLeft: 5,
              height: 50,
              width: "85%",
            }}
          >
            <TextInput
              style={{
                color: COLORS.black_txt,
                fontSize: FONTS_SIZE.txt_14,
                fontFamily: FONTS.FontRegular,
                textAlign: "left",
                flex: 1,
                //marginLeft: 10,
              }}
              placeholder="Search for message"
              placeholderTextColor={COLORS.gry_light}
              onChangeText={(newText) => {
                searchFilterFunction(newText);
              }}
              value={searchInfluencer}
              returnKeyType={"default"}
              onSubmitEditing={() => {
                getData(searchInfluencer, false);
              }}
            />
          </View>
        </View>
      ) : null}

      <FlatList
        data={chatListArray}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 10,
          paddingRight: 10,
          // paddingBottom: hp(20),
          paddingBottom: 10,
          marginTop: 5,
        }}
        renderItem={({ item, index }) => {
          return (
            <ItemMessageUserProfileList
              item={item}
              onItemClick={() => {
                navigation.navigate("ChatScreen", {
                  item: {
                    id:
                      item.user != undefined &&
                        item.user != null &&
                        item.user.id != undefined &&
                        item.user.id != null
                        ? item.user.id
                        : 0,
                    name:
                      item.user != undefined &&
                        item.user != null &&
                        item.user.fullname != undefined &&
                        item.user.fullname != null
                        ? item.user.fullname
                        : "",
                    profileImgUrl:
                      item.user != undefined &&
                        item.user != null &&
                        item.user.image != undefined &&
                        item.user.image != null &&
                        item.user.image != ""
                        ? IMG_BASE_URL + item.user.image
                        : "",
                  },
                });

                // console.log(item, 'Click Item---------------');
              }}
            />
          );
        }}
        ListEmptyComponent={() => {
          return isLoading === false ? (
            <EmptyView
              msgText={
                "We are excited to have you onboard. To get started, please review the request user sent you and hit accept when you are ready to start conversation."
              }
            />
          ) : null;
        }}
        keyExtractor={(_, index) => index.toString()}
        // onEndReachedThreshold={0.05}
        // onEndReached={fetchMoreData}
        // onRefresh={onRefresh}
        // refreshing={isRefresh}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Loader loading={isLoading} />
    </View>
  );
};

export default MessageUsersListPage;
