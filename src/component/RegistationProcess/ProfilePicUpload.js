import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import ButtonView from "../../common/ButtonView";
import Loader from "../../common/LoadingScreen";
import TextCommonMedium from "../../common/TextCommonMedium";
import TextInputView from "../../common/TextInputView";
import { BASE_URL, COLORS, FONTS_SIZE, activeOpacity } from "../../common/utils";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import ToolbarBackButton from "../../common/ToolbarBackButton";
import FastImage from "react-native-fast-image";
import ImagePickerCommon from "../../common/ImagePickerCommon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetPermission from "../../common/InternetPermission";
import APIWebCall from "../../common/APIWebCall";
import SnackBarCommon from "../../common/SnackBarCommon";
import TextCommonSemiBlod from "../../common/TextCommonSemiBlod";
import statusView from "../../common/statusView";
let { width, height } = Dimensions.get("window");

let boxCount = 2;
let boxWidth = width / boxCount;

function ProfilePicUpload({ navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [statusProgressCount, setStatusProgressCount] = useState(2);
  const [isImageSelectClick, setIsImageSelectClick] = useState(false);
  const [fileUri_profile, setfileUri_profile] = useState("");
  const [fileName_pro_profile, setfileName_pro_profile] = useState("");
  const [fileType_profile, setfileType_profile] = useState("");

  useEffect(() => { }, []);

  const onNextClick = async () => {
    Keyboard.dismiss();
    if (
      fileUri_profile === "" ||
      fileUri_profile === null ||
      fileUri_profile === undefined
    ) {
      showMessage({
        message: "Please upload profile image",
        type: "danger",
      });
    } else {
      var user_id = await AsyncStorage.getItem("user_id");
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();
      var data = new FormData();
      data.append("user_id", user_id);

      const new_profile = {
        name: fileName_pro_profile,
        type: fileType_profile,
        // uri: Platform.OS === "android" ? element.uri : element.uri.replace("ph://", ""),
        uri:
          Platform.OS === "android"
            ? fileUri_profile.includes("file://")
              ? fileUri_profile
              : fileUri_profile.includes("content://")
                ? fileUri_profile
                : "file://" + fileUri_profile
            : fileUri_profile.replace("file://", ""),
      };
      data.append("profile_image", new_profile);

      data.append("step", 2);
      if (isInternetGranted == true) {
        onUserPhotoApiCall(data);
      }
    }
  };

  const onUserPhotoApiCall = (data) => {
    setisLoading(true);
    console.log("[ProfilePicUpload] addProfilePic API Triggered");
    console.log("[ProfilePicUpload] Endpoint: addProfilePic");
    console.log("[ProfilePicUpload] Full URL:", BASE_URL + "addProfilePic");
    console.log("[ProfilePicUpload] Payload: Step 2 Completed");
    APIWebCall.onUserPhotoApiCall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[ProfilePicUpload] addProfilePic Response:", response);
        if (response.data != null || response.data != undefined) {
          navigation.navigate("TypeSelect");
        } else {
          showMessage({
            message: response.message,
            type: "danger",
          });
        }
      })
      .catch((err) => {
        console.log("[ProfilePicUpload] addProfilePic Error:", err);
        setisLoading(false);
        showMessage({
          message: err.message,
          type: "danger",
        });
      })
      .finally(() => setisLoading(false));
  };

  const onImageSelectDone = (selectedImages) => {
    console.log('vvvvvvvvvvvvvvvvvvv', selectedImages);

    setIsImageSelectClick(false);
    if (
      selectedImages != undefined ||
      selectedImages != null ||
      selectedImages.length > 0
    ) {
      const obj = selectedImages[0];
      console.log({ obj });

      if (obj != undefined || obj != null) {
        setfileName_pro_profile(obj.fileName);
        setfileType_profile(obj.typeM);
        setfileUri_profile(obj.uri);
      }
    }
  };

  const uploadProfilePhoto = async (images) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var user_id = await AsyncStorage.getItem("user_id");
      setisLoading(true);

      var data = new FormData();
      const new_profile = {
        name: images.fileName,
        type: images.typeM,
        // uri: Platform.OS === "android" ? element.uri : element.uri.replace("ph://", ""),
        uri:
          Platform.OS === "android"
            ? images.uri.includes("file://")
              ? images.uri
              : images.uri.includes("content://")
                ? images.uri
                : "file://" + images.uri
            : images.uri.replace("file://", ""),
      };
      data.append("image", new_profile);
      data.append("user_id", user_id);

      onUploadProfilePhotoAPICall(data);
    }
  };

  const onUploadProfilePhotoAPICall = (data) => {
    console.log("[ProfilePicUpload] UploadProfilePic API Triggered");
    console.log("[ProfilePicUpload] Endpoint: UploadProfilePic");
    console.log("[ProfilePicUpload] Full URL:", BASE_URL + "UploadProfilePic");
    APIWebCall.onUploadProfilePicAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[ProfilePicUpload] UploadProfilePic Response:", response);
      })
      .catch((err) => {
        console.log("[ProfilePicUpload] UploadProfilePic Error:", err);
        console.log("err========> ", err);
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => setisLoading(false));
  };
  const nameView = (lable, placeHolder, onChangeText, value, keyboardType) => {
    return (
      <View
        style={{
          flex: 1,
          height: 110,
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
          btnText={"Profile Image Upload"}
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
                height: 150,
                width: 150,
                marginBottom: 5,
                alignSelf: 'center',
              }}
            /> */}

            {/* <TextCommonMedium
              text={'Pick Your Profile Image'}
              color={COLORS.gry_text}
              fontSize={FONTS_SIZE.txt_16}
              fontWeight={'400'}
              marginLeft={5}
            /> */}

            <TouchableOpacity
              style={{
                alignItems: "center",
                backgroundColor: "white",
                justifyContent: "center",
                alignSelf: "center",
                height: 160,
                width: 160,
                borderRadius: 160 / 2,
                borderWidth: 1.5,
                borderColor: COLORS.light_pink,
                marginTop: 20,
              }}
              activeOpacity={activeOpacity}
              onPress={() => {
                setIsImageSelectClick(true);
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  height: 150,
                  width: 150,
                  borderRadius: 150 / 2,
                }}
                activeOpacity={activeOpacity}
                onPress={() => {
                  setIsImageSelectClick(true);
                }}
              >
                <FastImage
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 150 / 2,
                  }}
                  source={
                    fileUri_profile != ""
                      ? { uri: fileUri_profile }
                      : require("../../assets/user_pro.png")
                  }
                // source={require('../../assets/user_pro.png')}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsImageSelectClick(true);
              }}
              style={{
                backgroundColor: COLORS.very_light_orange,
                borderRadius: 30,
                paddingStart: 25,
                paddingEnd: 25,
                paddingTop: 4,
                paddingBottom: 4,
                //width: 150,
                alignItems: "center",
                alignSelf: "center",
                marginTop: 10,
              }}
            >
              <TextCommonSemiBlod
                text={"Pick Image"}
                fontSize={FONTS_SIZE.txt_13}
                fontWeight={"500"}
                color={COLORS.black_txt}
                textAlign={"center"}
              />
            </TouchableOpacity>
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
        <ImagePickerCommon
          onImageSelectDone={onImageSelectDone}
          onImageSelectOpen={isImageSelectClick}
          setIsImageSelectClick={setIsImageSelectClick}
        />
        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
  );
}

export default ProfilePicUpload;
