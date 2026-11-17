import React, { useEffect, useState } from "react";
import {
  FlatList, View,
  RefreshControl
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ItemNotificationList from "../ItemView/ItemNotificationList";
import ToolbarBackButton from "../common/ToolbarBackButton";
import { COLORS, analyticsLog } from "../common/utils";
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
import useAsyncStorageCommon from "./../common/AsyncStorageCommon";

const NotificationPage = ({ navigation, route }) => {
  const { HeaderVisible } = route.params;
  const [notificationArray, setNotificationArray] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [clickedItem, setClickedItem] = useState({});
  const [isAccept, setIsAccept] = useState(false);
  const [isConfirmAlertShow, setIsConfirmAlertShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const {
    item: itemNotiCount,
    setItem: setNotiCount,
    removeItem: removeNotiCount,
  } = useAsyncStorageCommon("noti_count");

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getData();
  //     analyticsLog("Notification_screen");
  //   }, [])
  // );

  useEffect(() => {
    getData(false);
    analyticsLog("Notification_screen");
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
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    var user_id_db = await AsyncStorage.getItem("user_id");

    if (isInternetGranted == true) {
      if (pullRefresh === false) {
        setisLoading(true);
      }
      var data = new FormData();
      data.append("user_id", user_id_db);

      console.log(data);
      var res = await APIWebCall.UnreadNotificationCountAPI(data);

      console.log("unread====> ", res);
      removeNotiCount();

      onNotificationListAPICall(data);
    }
  };

  const onNotificationListAPICall = async (data) => {
    setisLoading(true);
    APIWebCall.onNotificationListAPICall(data)
      .then(async (response) => {
        setisLoading(false);

        if (response.data.user != undefined && response.data.user != null)
          setNotificationArray(response.data.user);
      })
      .catch((err) => {
        setisLoading(false);
        setTimeout(() => {
          SnackBarCommon({ text: err.message });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  // const onInfluencerProfileClick = async (item) => {
  //   navigation.navigate('NotificationDetailsAdd', { item: item });
  // };

  const onAcceptOrRejectClickCall = async () => {
    var user_id = await AsyncStorage.getItem("user_id");
    var data = new FormData();
    data.append("user_id", user_id);
    data.append("influencer_id", clickedItem.user_id);
    data.append("id", clickedItem.id);
    data.append("type", isAccept ? "1" : "2"); // 1 for accept, 2 for reject
    onAcceptOrRejectApiCall(data);
  };

  const onAcceptOrRejectApiCall = async (data) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      setisLoading(true);
      APIWebCall.onAcceptOrRejectAPICall(data)
        .then(async (response) => {
          setisLoading(false);
          SnackBarCommon({ text: response.message });
          getData();
        })
        .catch((err) => {
          setisLoading(false);
          setTimeout(() => {
            SnackBarCommon({ text: err.message });
          }, 120);
        })
        .finally(() => setisLoading(false));
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // Add new items or update the data
      getData(true);
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
        btnText={"Notification"}
        backIcon={require("../assets/menu_icon.png")}
        onBackClick={() => openControlPanel()}
      />

      <FlatList
        data={notificationArray}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
          marginTop: 5,
        }}
        renderItem={({ item, index }) => {
          return (
            <ItemNotificationList
              item={item}
              // onItemClick={() => {
              //   onInfluencerProfileClick(item);
              // }}
              onAcceptClick={() => {
                setIsAccept(true);
                setClickedItem(item);
                setIsConfirmAlertShow(true);
              }}
              onRejectClick={() => {
                setIsAccept(false);
                setClickedItem(item);
                setIsConfirmAlertShow(true);
              }}
            />
          );
        }}
        ListEmptyComponent={() => {
          return isLoading === false ? (
            <EmptyView msgText={"No data found"} />
          ) : null;
        }}
        keyExtractor={(_, index) => index.toString()}
        // onEndReachedThreshold={0.05}
        // onEndReached={fetchMoreData}
        // onRefresh={onRefresh}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <LogoutDialog
        loading={isConfirmAlertShow}
        msg_title={"Alert!"}
        msg_text={`Do you really want to ${isAccept ? "accept" : "reject"}?`}
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          setIsConfirmAlertShow(false);
          onAcceptOrRejectClickCall();
        }}
        onPressLeftButton={() => setIsConfirmAlertShow(false)}
      />

      <Loader loading={isLoading} />
    </View>
  );
};

export default NotificationPage;
