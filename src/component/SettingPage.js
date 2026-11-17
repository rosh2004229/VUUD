import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, Alert } from "react-native";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import {
  ABOUT_US,
  COLORS,
  FONTS_SIZE,
  PRIVACY_POLICY,
  elevation,
} from "../common/utils";
import LogoutDialog from "../common/LogoutDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import Loader from "../common/LoadingScreen";
import SnackBarCommon from "../common/SnackBarCommon";
import ToolbarBackButton from "../common/ToolbarBackButton";
import SwitchCommon from "../common/SwitchCommon";
import useAsyncStorageCommon from "./../common/AsyncStorageCommon";

function SettingPage({ navigation }) {
  const [deleteModelVisible, setDeleteModelVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [convertUserModel, setConvertUserModel] = useState(false);

  const [notificationSwitch, setNotificationSwitch] = useState(false);
  const [userData, setUserData] = useState({});
  const [userType, setUserType] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    var user_id = await AsyncStorage.getItem("user_id");

    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    var user_type = await AsyncStorage.getItem("user_type");
    setUserType(user_type);

    var data = new FormData();
    data.append("user_id", user_id);

    if (isInternetGranted == true) {
      setisLoading(true);
      onGetAllProfileDataAPICall(data);
    }
  };

  const onGetAllProfileDataAPICall = (data) => {
    APIWebCall.onGetUserAPICall(data, navigation)
      .then(async (response) => {
        setisLoading(false);

        setNotificationSwitch(
          response.data.user.notification === 0 ? true : false
        );
      })
      .catch((err) => {
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const onNotificationSwitchClick = async (value) => {
    var user_id = await AsyncStorage.getItem("user_id");

    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    var data = new FormData();
    data.append("user_id", user_id);
    data.append("notification", value === true ? "0" : "1");

    if (isInternetGranted == true) {
      setisLoading(true);
      onNotificationSwitchChangeAPICall(data);
    }
  };

  const {
    item: itemNotiCount,
    setItem: setNotiCount,
    removeItem: removeNotiCount,
  } = useAsyncStorageCommon("noti_count");

  const onNotificationSwitchChangeAPICall = (data) => {
    APIWebCall.onNotificationSwitchChangeAPICall(data)
      .then(async (response) => {
        setisLoading(false);
      })
      .catch((err) => {
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const convertToUser = async () => {
    var user_id = await AsyncStorage.getItem("user_id");
    let data = new FormData();
    data.append("user_id", user_id);
    var res = await APIWebCall.getConvertToInfluencerAPI(data);
    if (res?.data?.user != undefined) {
      setConvertUserModel(false);
      AsyncStorage.clear();
      navigation.dispatch(StackActions.replace("LoginPage"));
      // removeNotiCount();
    } else {
      setConvertUserModel(false);
      SnackBarCommon({ text: res?.message });
    }
  };

  const LogoutClick = () => {
    try {
      navigation.replace("LoginPage");
    } catch (e) { }
  };

  const onDeleteAccountApiCall = async () => {
    // setisLoading(true);
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

  const onDeleteAccountAPICall = (data) => {
    APIWebCall.onDeleteAccountAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        setDeleteModelVisible(false);
        AsyncStorage.clear();
        navigation.replace("LoginPage");
        setTimeout(() => {
          SnackBarCommon({ text: response.message, isSuccess: true });
        }, 120);
      })
      .catch((err) => {
        setisLoading(false);
        console.log("errrrrrerrrrrrrrrrrrrr", err);
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
            padding: 15,
            marginTop: 15,
            shadowColor: COLORS.shadow_color,
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: elevation,
            backgroundColor: COLORS.white_txt,
            borderRadius: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{
                height: 25,
                width: 25,
                tintColor:
                  txt === "Delete Account"
                    ? COLORS.color_red
                    : COLORS.black_txt,
              }}
              source={icon}
              resizeMode={"contain"}
            />

            <TextCommonSemiBlod
              text={txt}
              color={
                txt === "Delete Account" ? COLORS.color_red : COLORS.gry_text
              }
              fontSize={FONTS_SIZE.txt_15}
              fontWeight={"500"}
              marginLeft={15}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.white_original,
        flex: 1,
      }}
    >
      <ToolbarBackButton
        btnText={"Settings"}
        onBackPress={() => navigation.goBack()}
      />
      <View style={{ marginLeft: 20, marginRight: 20, marginTop: 0 }}>
        <View
          style={{
            padding: 15,
            marginTop: 15,
            shadowColor: COLORS.shadow_color,
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: elevation,
            backgroundColor: COLORS.white_txt,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: COLORS.colorWhite,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.colorPrimary,
              }}
              source={require("../assets/notification.png")}
            />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <TextCommonSemiBlod
                text={"Notification"}
                color={COLORS.gry_text}
                fontSize={FONTS_SIZE.txt_14}
                fontWeight={"500"}
                marginLeft={0}
                textAlign={"left"}
              />
            </View>

            <SwitchCommon
              onValueChange={(val) => {
                setNotificationSwitch(val);
                onNotificationSwitchClick(val);
              }}
              value={notificationSwitch}
            />
          </View>
        </View>

        {onCommonLeftView(
          require("../assets/insurance.png"),
          "Privacy & Policy",
          () => {
            navigation.navigate("PACPage", {
              text: "Privacy & Policy",
              link: PRIVACY_POLICY,
            });
          }
        )}

        {onCommonLeftView(require("../assets/info.png"), "About Us", () => {
          navigation.navigate("PACPage", {
            text: "About Us",
            link: ABOUT_US,
          });
        })}

        {/* {onCommonLeftView(require('../assets/call.png'), 'Contact Us', () => {
          navigation.navigate('PACPage', { text: 'Contact Us', link: null });
        })} */}

        {userType === "1" &&
          onCommonLeftView(
            require("../assets/convertUser.png"),
            "Convert To Influenstar",
            () => {
              setConvertUserModel(true);
            }
          )}

        {onCommonLeftView(require("../assets/logout.png"), "Log Out", () => {
          setIsLoginVisible(true);
        })}
        {onCommonLeftView(
          require("../assets/remove_user.png"),
          "Delete Account",
          () => {
            setDeleteModelVisible(true);
          }
        )}
      </View>

      <LogoutDialog
        loading={convertUserModel}
        msg_title={"Are you sure want to convert into Influencer?"}
        msg_text={
          "If you want to convert into influencer, you will be logged out once and please login again to explore feature of the influencer"
        }
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          setConvertUserModel(false);
          try {
            convertToUser();
          } catch (e) {
            console.log(e);
          }
        }}
        onPressLeftButton={() => setConvertUserModel(false)}
      />

      <LogoutDialog
        loading={deleteModelVisible}
        msg_title={"Delete Account!"}
        msg_text={"Are you sure you want to delete account?"}
        leftButtonText={"NO"}
        rightButtonText={"YES"}
        onPressRightButton={() => {
          // onDeleteAccountApiCall();
          alert("sddd");
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
            navigation.dispatch(StackActions.replace("OnBoardingPage"));
            // removeNotiCount();
          } catch (e) {
            console.log(e);
          }
        }}
        onPressLeftButton={() => setIsLoginVisible(false)}
      />

      <Loader loading={isLoading} />
    </View>
  );
}
export default SettingPage;
