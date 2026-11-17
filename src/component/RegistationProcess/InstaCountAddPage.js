import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import ButtonView from "../../common/ButtonView";
import Loader from "../../common/LoadingScreen";
import TextCommonMedium from "../../common/TextCommonMedium";
import TextInputView from "../../common/TextInputView";
import {
  BASE_URL,
  COLORS,
  FONTS_SIZE,
  kFormatter,
  kFormatterYoutube,
} from "../../common/utils";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import ToolbarBackButton from "../../common/ToolbarBackButton";
let { width, height } = Dimensions.get("window");

let boxCount = 2;
let boxWidth = width / boxCount;
import axios from "axios";
import statusView from "../../common/statusView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetPermission from "../../common/InternetPermission";
import APIWebCall from "../../common/APIWebCall";

function InstaCountAddPage({ navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [statusProgressCount, setStatusProgressCount] = useState(4);
  const [instagram_id, setInstagramId] = useState("");
  const [youTubeChannelName, setYouTubeChannelName] = useState("");
  const [youTube_Suscriber_Count, setYouTube_Suscriber_Count] = useState("0");
  const [youTube_Suscriber_Pass_API, setYouTube_Suscriber_Pass_API] =
    useState("0");
  const [youTube_getSub_Error, setYouTube_getSub_Error] = useState(null);
  const [instagram_followers, setInstagramFollowers] = useState(0);
  const [instagram_followers_Error, setInstagramFollowersError] =
    useState(null);

  const [youtube_id, setYouTubeId] = useState("");
  const [instagram_followers_pass_API, setInstagramFollowersPassAPI] =
    useState("0");
  const [isCheckBtnClicked, setCheckBtnClicked] = useState(false);

  useEffect(() => { }, []);

  const onNextClick = async () => {
    Keyboard.dismiss();
    if (instagram_id === "") {
      showMessage({
        message:
          "Enter instagram id and click check button to fetch followers count",
        type: "danger",
      });
    } else if (isCheckBtnClicked === false) {
      showMessage({
        message: "Click check Followers button to fetch followers count",
        type: "danger",
      });
    }
    // else if (youtube_id == '') {
    //   showMessage({
    //     message:
    //       'Enter YouTube Channel and click check button to fetch followers count',
    //     type: 'danger',
    //   });
    // }
    else {
      var user_id = await AsyncStorage.getItem("user_id");
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();

      if (isInternetGranted == true) {
        var data = new FormData();
        data.append("user_id", user_id);
        data.append(
          "instagram_username",
          instagram_id != null || instagram_id != "" ? instagram_id : ""
        );
        data.append(
          "youtube_username",
          youtube_id != null || youtube_id != "" ? youtube_id : ""
        );
        data.append("twitter_username", "");
        data.append("step", 4);
        data.append(
          "instagram_count",
          instagram_followers_pass_API != undefined &&
            instagram_followers_pass_API != null &&
            instagram_followers_pass_API != ""
            ? instagram_followers_pass_API
            : 0
        );
        data.append(
          "youtube_count",
          youTube_Suscriber_Pass_API != undefined &&
            youTube_Suscriber_Pass_API != null &&
            youTube_Suscriber_Pass_API != ""
            ? youTube_Suscriber_Pass_API
            : 0
        );

        console.log("instagram count =====> ", data);

        InstagramDetailsAddApiCall(data);
      }
    }
  };

  const InstagramDetailsAddApiCall = (data) => {
    setisLoading(true);
    console.log("[InstaCountAddPage] addSocial API Triggered");
    console.log("[InstaCountAddPage] Endpoint: addSocial");
    console.log("[InstaCountAddPage] Full URL:", BASE_URL + "addSocial");
    console.log("[InstaCountAddPage] Payload:", {
      instagram_username: instagram_id,
      youtube_username: youTubeChannelName,
      instagram_count: instagram_followers_pass_API,
      youtube_count: youTube_Suscriber_Pass_API,
      step: 4,
    });
    APIWebCall.onInstagramDetailsAddApiCall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[InstaCountAddPage] addSocial Response:", response);
        console.log("response.data.user ==> ", JSON.stringify(response));
        if (response.data != null || response.data != undefined) {
          navigation.navigate("CategorySelectRegisterPage");
          setInstagramFollowers(0)
          setInstagramId("")
        } else {
          showMessage({
            message: response.message,
            type: "danger",
          });
        }
      })
      .catch((err) => {
        console.log("[InstaCountAddPage] addSocial Error:", err);
        setisLoading(false);
        showMessage({
          message: err.message,
          type: "danger",
        });
      })
      .finally(() => setisLoading(false));
  };

  const getInstagramFollowers = () => {
    setInstagramFollowersError(null);
    setisLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        "https://i.instagram.com/api/v1/users/web_profile_info/?username=" +
        instagram_id,
      headers: {
        "user-agent":
          "Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)",
        Accept: "application/json",
      },
    };

    axios
      .request(config)
      .then((res) => {
        try {
          setInstagramFollowers(
            kFormatter(res.data.data.user.edge_followed_by.count)
          );
          setInstagramFollowersPassAPI(
            res.data.data.user.edge_followed_by.count
          );
          setInstagramFollowersError(null);
        } catch (error) {
          console.log("error ====> ", error);
          setInstagramFollowers(kFormatter("0"));
          setInstagramFollowersPassAPI("0");
          setInstagramFollowersError(
            "Please try later instagram server is not responding right now."
          );
        }
      })
      .catch((error) => {
        console.log("error:\n" + error);
        setInstagramFollowers(kFormatter("0"));
        setInstagramFollowersPassAPI("0");
        setInstagramFollowersError("Instagram id does not found");
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const getYoutubeSub = async () => {
    setYouTube_getSub_Error(null);
    setisLoading(true);
    const API_KEY = "AIzaSyDdHVhQHMXeGZGtDftGEw3RBLa3OtGKSd4";
    // https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=dhruvrathee&key=AIzaSyDdHVhQHMXeGZGtDftGEw3RBLa3OtGKSd4

    try {
      // Fetching channel ID
      //  const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=' +youtube_id +'&key=' + API_KEY );
      const channelResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
        youtube_id +
        "&type=channel&key=" +
        API_KEY
      );
      console.log(
        channelResponse?.data?.items[0]?.id.channelId,
        "channelResponse-----"
      );
      const channelId = channelResponse?.data?.items[0]?.id.channelId;

      // Fetching subscriber count using channel ID
      const subscriberResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" +
        channelId +
        "&key=" +
        API_KEY
      );
      const subscriberCount =
        subscriberResponse.data.items[0].statistics.subscriberCount;
      setYouTube_Suscriber_Count(kFormatterYoutube(subscriberCount));
      setYouTube_Suscriber_Pass_API(subscriberCount);
      setisLoading(false);
    } catch (error) {
      console.error("Error fetching subscriber count:", error);
      setYouTube_Suscriber_Count(kFormatter(0));
      setisLoading(false);
      setYouTube_getSub_Error("Youtube channel does not found.");
    }
  };

  const nameView = (lable, placeHolder, onChangeText, value, keyboardType) => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <TextInputView
          text={lable}
          placeholder={placeHolder}
          onChangeText={onChangeText}
          secureTextEntry={false}
          value={value}
          keyboardType={keyboardType}
          multiline={false}
        />
      </View>
    );
  };

  return (
    <ImageBackground
      style={{ width: wp(100), height: hp(100) }}
      source={require("../../assets/bg_3.png")}
    >
      <View style={{ flex: 1 }}>
        <ToolbarBackButton
          btnText={"Social Followers"}
          onBackPress={() => navigation.goBack()}
        />
        <ScrollView style={{ height: "100%", width: "100%" }}>
          <View style={{ marginLeft: 10, marginRight: 10, marginTop: 5 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              {statusView(statusProgressCount, 1, "Name")}
              {statusView(statusProgressCount, 2, "Profile Pic")}
              {statusView(statusProgressCount, 3, "User Type")}
              {statusView(statusProgressCount, 4, "Social")}
              {statusView(statusProgressCount, 5, "Category")}
              {statusView(statusProgressCount, 6, "Media")}
              {statusView(statusProgressCount, 7, "Keywords")}
              {statusView(statusProgressCount, 8, "Country")}
            </View>
            {/* <Image
              source={require('../../assets/app_logo_2.png')}
              resizeMode={'contain'}
              style={{
                height: 180,
                width: 180,
                marginBottom: 5,
                alignSelf: 'center',
              }}
            /> */}

            {/* <TextCommonMedium
              text={'Update Social Counts'}
              color={COLORS.gry_text}
              fontSize={FONTS_SIZE.txt_16}
              fontWeight={'400'}
              marginLeft={5}
            /> */}

            <View
              style={{ flex: 1, marginTop: 10, marginStart: 10, marginEnd: 10 }}
            >
              {nameView(
                "Instagram ID*",
                "Enter instagram id",
                (newText) => setInstagramId(newText),
                instagram_id,
                "default"
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  alignItems: "center",
                  marginTop: 5,
                  marginTop: 10,
                }}
              >
                {instagram_followers != "0" ? (
                  <TextCommonMedium
                    marginRight={15}
                    text={"Followers: " + instagram_followers}
                  />
                ) : instagram_followers_Error != null ? (
                  <TextCommonMedium
                    marginRight={15}
                    fontSize={FONTS_SIZE.txt_12}
                    color={COLORS.color_red}
                    text={instagram_followers_Error}
                    textAlign={"center"}
                    width={wp(50)}
                  />
                ) : null}
                <ButtonView
                  backgroundColor={COLORS.colorGreen}
                  btnText={"Check"}
                  height={35}
                  btntxColor={COLORS.white_txt}
                  borderColor={COLORS.colorGreen}
                  onPress={() => {
                    setCheckBtnClicked(true);
                    if (instagram_id === "") {
                      showMessage({
                        message: "Enter instagram id",
                        type: "danger",
                      });
                    } else {
                      getInstagramFollowers();
                    }
                  }}
                />
              </View>

              {nameView(
                "YouTube Channel",
                "Enter youtube channel",
                (newText) => setYouTubeId(newText),
                youtube_id,
                "default"
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  alignItems: "center",
                  marginTop: 5,
                  marginTop: 10,
                }}
              >
                {youTube_Suscriber_Count != "0" ? (
                  <TextCommonMedium
                    marginRight={15}
                    text={"Subscribers: " + youTube_Suscriber_Count}
                  />
                ) : youTube_getSub_Error != null ? (
                  <TextCommonMedium
                    marginRight={15}
                    fontSize={FONTS_SIZE.txt_12}
                    color={COLORS.color_red}
                    text={youTube_getSub_Error}
                    textAlign={"center"}
                    width={wp(50)}
                  />
                ) : null}
                <ButtonView
                  backgroundColor={COLORS.colorGreen}
                  btnText={"Check"}
                  height={35}
                  btntxColor={COLORS.white_txt}
                  borderColor={COLORS.colorGreen}
                  onPress={() => {
                    setCheckBtnClicked(true);
                    if (youtube_id === "") {
                      showMessage({
                        message: "Enter Youtube channel",
                        type: "danger",
                      });
                    } else {
                      getYoutubeSub();
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 40,
            width: "95%",
            alignSelf: "center",
          }}
        >
          <ButtonView
            backgroundColor={COLORS.colorGreen}
            btnText={"Next"}
            btntxColor={COLORS.white_txt}
            borderColor={COLORS.colorGreen}
            onPress={() => onNextClick()}
          />
        </View>
        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
  );
}

export default InstaCountAddPage;
