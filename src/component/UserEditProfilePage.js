import React, { Component, useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  FlatList,
  Text,
  PermissionsAndroid,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextCommonMedium from "../common/TextCommonMedium";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import TextInputView from "../common/TextInputView";
import ButtonView from "../common/ButtonView";
import {
  COLORS,
  FONTS,
  FONTS_SIZE,
  IMG_BASE_URL,
  activeOpacity,
  analyticsLog,
  dateDisplayFormate,
  elevation,
} from "../common/utils";
import Snackbar from "react-native-snackbar";
import APIWebCall from "../common/APIWebCall";
import NetInfo from "@react-native-community/netinfo";
import Loader from "../common/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetPermission from "../common/InternetPermission";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CommonOTPAPiCall from "../common/CommonOTPAPiCall";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioButton from "../common/RadioButton";
import ImagePickerCommon from "../common/ImagePickerCommon";
import TextCommonregular from "../common/TextCommonregular";
import moment from "moment/moment";
import ToolbarBackButton from "../common/ToolbarBackButton";
import SnackBarCommon from "../common/SnackBarCommon";
import TabView from "../common/TabView";
import Modal from "react-native-modal";
//import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";

import MultipleImagePicker, {
  // @ts-ignore
  openPicker,
} from "@baronha/react-native-multiple-image-picker";
import LogoutDialog from "../common/LogoutDialog";
import FastImage from "react-native-fast-image";
import Video from 'react-native-video';

function UserEditProfilePage({ navigation }) {
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [number, setNumber] = useState("");
  const [full_name, setFullName] = useState("");
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState(1);
  const [website_url, setWebsiteUrl] = useState("");
  const [company_name, setCompanyName] = useState("");
  const [facebook_id, setFacebookId] = useState("");
  const [instagram_id, setInstagramId] = useState("");
  const [youTubeChannelName, setYouTubeChannelName] = useState("");
  const [linkedInName, setLinkedInName] = useState("");
  const [pinterestName, setPinterestName] = useState("");

  const [fileName_pro_profile, setfileName_pro_profile] = useState("");
  const [fileType_profile, setfileType_profile] = useState("");
  const [fileUri_profile, setfileUri_profile] = useState("");

  const [isLoading, setisLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isImageSelectClick, setIsImageSelectClick] = useState(false);

  const [socialView, setSocialView] = useState(false);
  const [personalView, setPersonalView] = useState(true);
  const [twitterID, settwitterId] = useState("");
  const [isCameraDialogVisible, setIsCameraDialogVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [imageMaxLimitForNow, setImageMaxLimitForNow] = useState(5);
  const [fImages, setFImages] = useState([]);
  const [imagesLive, setImagesLive] = useState([]);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [removeIds, setRemoveIds] = useState("");
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState("");

  const [defaultImgSelect, setDefaultImgSelect] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFImages([]);
      setListInView();
      setDefaultImgSelect(false);
      setFullName("");
      setNumber("");
      setEmail("");
      setBirthDate("");
      setAbout("");
      getData();
      analyticsLog("UserEdit_profile_screen");
    }, [])
  );

  const getData = async () => {
    var user_id = await AsyncStorage.getItem("user_id");
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

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
        setUserData(response.data.user);

        if (
          response.data.user.fullname != null &&
          response.data.user.fullname != undefined
        ) {
          setFullName(response.data.user.fullname);
        }

        if (
          response.data.user.mobile != null &&
          response.data.user.mobile != undefined
        ) {
          setNumber(response.data.user.mobile);
        }

        if (
          response.data.user.email != null &&
          response.data.user.email != undefined
        ) {
          setEmail(response.data.user.email);
        }

        if (
          response.data.user.birthdate != null &&
          response.data.user.birthdate != undefined
        ) {
          //setBirthDate(response.data.user.birthdate);
          setBirthDate(response.data.user.birthdate);
        }

        if (
          response.data.user.gender != null &&
          response.data.user.gender != undefined
        ) {
          setGender(response.data.user.gender);
        }
        if (
          response.data.user.about != null &&
          response.data.user.about != undefined
        ) {
          setAbout(response.data.user.about);
        }

        // if (
        //     response.data.user.website_url != null &&
        //     response.data.user.website_url != undefined
        // ) {
        //     setWebsiteUrl(response.data.user.website_url);
        // }

        // if (
        //     response.data.user.company_name != null &&
        //     response.data.user.company_name != undefined
        // ) {
        //     setCompanyName(response.data.user.company_name);
        // }

        // if (
        //     response.data.user.instagram_username != null &&
        //     response.data.user.instagram_username != undefined
        // ) {
        //     setInstagramId(response.data.user.instagram_username);
        // }
        // if (
        //     response.data.user.youtube_username != null &&
        //     response.data.user.youtube_username != undefined
        // ) {
        //     setYouTubeChannelName(response.data.user.youtube_username);
        // }

        // if (
        //     response.data.user.facebook_username != null &&
        //     response.data.user.facebook_username != undefined
        // ) {
        //     setFacebookId(response.data.user.facebook_username);
        // }
        // if (
        //     response.data.user.linkedin_username != null &&
        //     response.data.user.linkedin_username != undefined
        // ) {
        //     setLinkedInName(response.data.user.linkedin_username);
        // }

        // if (
        //     response.data.user.pinterest_username != null &&
        //     response.data.user.pinterest_username != undefined
        // ) {
        //     setPinterestName(response.data.user.pinterest_username);
        // }

        if (
          response.data.user.image != null &&
          response.data.user.image != undefined
        ) {
          setProfileImage(response.data.user.image);
        }

        if (
          response.data.user.profile_image != null &&
          response.data.user.profile_image != undefined
        ) {
          if (response.data.user.profile_image.length > 0) {
            // AsyncStorage.setItem(
            //   'user_profile_pic',
            //   response.data.user.profile_image[0].image.toString()
            // );

            var temp = [];
            response.data.user.profile_image.forEach((element) => {
              var objImg = {
                id: element.id,
                path: element.image != null ? IMG_BASE_URL + element.image : "",
                isOnline: true,
              };
              temp.push(objImg);
            });

            setFImages(temp);
          }
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
  const setListInView = () => {
    // var imagesList = [{ path: "", isOnline: false }];
    var imagesList = [];
    var iList1 = [];
    // if (item != undefined && item != null) {
    //   if (item.feed_images.length > 0) {
    //     item.feed_images.forEach((element) => {
    //       var objImg = {
    //         id: element.id,
    //         path: element.s3_image != null ? element.s3_image : '',
    //         isOnline: true,
    //       };
    //       imagesList.push(objImg);
    //       iList1.push(objImg);
    //     });
    //   }
    // }
    setImagesLive(iList1);
    setFImages(imagesList);
  };

  const onImageSelectDone = (selectedImages) => {
    setIsImageSelectClick(false);
    setDefaultImgSelect(true);
    if (
      selectedImages != undefined ||
      selectedImages != null ||
      selectedImages.length > 0
    ) {
      const obj = selectedImages[0];
      if (obj != undefined || obj != null) {
        setfileName_pro_profile(obj.fileName);
        setfileType_profile(obj.typeM);
        setfileUri_profile(obj.uri);
        setTimeout(() => {
          uploadProfilePhoto(obj);
        }, 500);
      }
    }
  };

  const uploadProfilePhoto = async (images) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var user_id = await AsyncStorage.getItem("user_id");

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
                : "file://" + element.uri
            : images.uri.replace("file://", ""),
      };
      data.append("image", new_profile);
      data.append("user_id", user_id);

      onUploadProfilePhotoAPICall(data);
    }
  };

  const onUploadProfilePhotoAPICall = (data) => {
    APIWebCall.onUploadProfilePicAPICall(data)
      .then(async (response) => {
        setisLoading(false);
      })
      .catch((err) => {
        console.log("err========> ", err);
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => setisLoading(false));
  };

  const onDateSelected = (event, value) => {
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false);
    }
    setBirthDate(value);
  };

  const onUpdateClick = async () => {
    if (full_name === "") {
      SnackBarCommon({ text: "Enter full name" });
    } else if (email === "") {
      SnackBarCommon({ text: "Enter email" });
    } else if (birth_date === "") {
      SnackBarCommon({ text: "Enter birth date" });
    } else if (about === "") {
      SnackBarCommon({ text: "Enter about" });
    } else if (gender === "") {
      SnackBarCommon({ text: "Select gender" });
    } else {
      var user_id = await AsyncStorage.getItem("user_id");
      var isInternetGranted =
        await InternetPermission.checkInternetPermissions();

      var data = new FormData();
      data.append("user_id", user_id);
      data.append("fullname", full_name);
      data.append("email", email);
      data.append(
        "birthdate",
        moment(new Date(birth_date)).format("DD MMM yyyy")
      );
      data.append("about", about);
      data.append("gender", gender);
      data.append("instagram_username", instagram_id);
      data.append("youtube_username", youTubeChannelName);
      data.append("twitter_username", twitterID);
      data.append("linkedin_username", linkedInName);
      data.append("facebook_username", facebook_id);
      data.append("pinterest_username", pinterestName);
      data.append("company_name", company_name);
      data.append("website_url", website_url);

      if (isInternetGranted == true) {
        onEditUserAPICall(data);
      }
    }
  };

  const onEditUserAPICall = (data) => {
    setisLoading(true);
    APIWebCall.onEditUserAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        if (response.data.user != undefined) {
          setTimeout(() => {
            navigation.goBack();
          }, 200);
          SnackBarCommon({ text: response.message, isSuccess: true });
        }
      })
      .catch((err) => {
        setisLoading(false);
        setTimeout(() => {
          SnackBarCommon({ text: err.message });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const hasCameraPermission = async () => {
    if (Platform.OS === "ios") {
      // const hasPermission = await this.hasCameraPermissionIOS();
      // return hasPermission;
      toggleModal();
    }

    if (Platform.OS === "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then((result) => {
        if (
          result["android.permission.CAMERA"] &&
          result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted"
        ) {
        }
      });
      return true;
    }
    return false;
  };

  const toggleModal = () => {
    setIsCameraDialogVisible(!isCameraDialogVisible);
  };

  const getImgPermission = async () => {
    const hasLocationPermission = await hasCameraPermission();
    if (!hasLocationPermission) {
      return;
    } else {
      toggleModal();
    }
  };

  const onMultipleVide = async () => {
    try {
      const singleSelectedMode = false;
      // toggleModal();
      const response = await MultipleImagePicker.openPicker({
        // selectedAssets: images,
        isExportThumbnail: true,
        //maxVideo: 2,
        mediaType: "all",
        maxVideoDuration: 30,
        doneTitle: "Done",
        isExportThumbnail: true,
        maxSelectedAssets: imageMaxLimitForNow,
        usedCameraButton: false,
        isCrop: true,
        isCropCircle: true,
        selectedColor: "#154293",
        singleSelectedMode,
      });

      // toggleModal();
      console.log({ response });
      var temp = [...response];
      for (let index = 0; index < temp.length; index++) {
        temp[index].isOnline = false;
      }
      setImages(temp);

      if (fImages.length > 0) {
        setFImages([...fImages, ...temp]);
      } else {
        setFImages([...temp]);
      }
      setTimeout(() => {
        uploadProfileImages(temp);
      }, 500);
    } catch (e) { }
  };

  const uploadProfileImages = async (images) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var user_id = await AsyncStorage.getItem("user_id");
      setisLoading(true);
      toggleModal();
      var data = new FormData();

      if (images.length > 1) {
        for (let index1 = 0; index1 < images.length; index1++) {
          const element_value = images[index1];
          const new_profile = {
            name: element_value.fileName,
            type: element_value.mime,
            // uri: Platform.OS === "android" ? element.uri : element.uri.replace("ph://", ""),
            uri:
              Platform.OS === "android"
                ? element_value.path.includes("file://")
                  ? element_value.path
                  : element_value.path.includes("content://")
                    ? element_value.path
                    : "file://" + element_value.path
                : element_value.path.replace("file://", ""),
          };

          data.append("profile_image[" + (index1 + 1) + "]", new_profile);
          data.append("type[]", element_value.type);
        }
      } else {
        const element = images[0];
        const new_profile = {
          name: element.fileName,
          type: element.mime,
          // uri: Platform.OS === "android" ? element.uri : element.uri.replace("ph://", ""),
          uri:
            Platform.OS === "android"
              ? element.path.includes("file://")
                ? element.path
                : element.path.includes("content://")
                  ? element.path
                  : "file://" + element.path
              : element.path.replace("file://", ""),
        };
        data.append("profile_image[]", new_profile);
        data.append("type[]", element.type);
      }
      data.append("user_id", user_id);

      onUploadImagesAPICall(data);

      // if (item != undefined && item != null) {
      //   data.append(
      //     'remove_ids',
      //     removeIds.substring(0, removeIds.length - 1),
      //   );
      //   data.append('id', item.id.toString());
      //   onGetEditFeedAPICall(data);
      // } else {
      //   onMemberAddfeedAPICall(data);
      // }
    }
  };

  const onUploadImagesAPICall = (data) => {
    APIWebCall.onProfileImagesUploadAPICall(data)
      .then(async (response) => {
        setisLoading(false);
      })
      .catch((err) => {
        console.log("err========> ", err);
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => setisLoading(false));
  };

  const deleteUserImage = async (imageId) => {
    var data = new FormData();
    data.append("id", imageId);
    onProfileImagesDeleteAPICall(data);
  };

  const onProfileImagesDeleteAPICall = (data) => {
    APIWebCall.onProfileImagesDeleteAPICall(data)
      .then(async (response) => {
        setisLoading(false);

        if (fImages[deleteIndex].isOnline === true) {
          setRemoveIds(removeIds + fImages[deleteIndex].id + ",");
        }
        var array = [...fImages];
        array.splice(deleteIndex, 1);
        setFImages(array);
      })
      .catch((err) => {
        console.log("err========> ", err);
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => setisLoading(false));
  };

  const accountView = (
    lable,
    placeHolder,
    onChangeText,
    value,
    keyboardType,
    onPressClick,
    multiline
  ) => {
    return (
      <TouchableOpacity
        onPress={onPressClick}
        activeOpacity={activeOpacity}
        style={
          {
            // backgroundColor: COLORS.white_txt,
            // borderRadius: 8,
            // paddingTop: 10,
            // paddingHorizontal: 10,
            // width: "90%",
            // justifyContent: 'center',
            // alignItems: 'center'
            // // height: lable === 'About' ? 200 : null,
            // marginVertical: 3,
            // shadowColor: COLORS.shadow_color,
            // shadowOffset: { width: -2, height: 3 },
            // shadowOpacity: 0.2,
            // shadowRadius: 10,
            // elevation: elevation
          }
        }
      >
        <TextInputView
          text={lable}
          placeholder={placeHolder}
          onChangeText={onChangeText}
          secureTextEntry={false}
          value={value}
          editable={keyboardType === "null" ? false : true}
          keyboardType={keyboardType === "null" ? "default" : keyboardType}
          height={lable === "About" ? 150 : null}
          multiline={multiline}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <StatusBar
        backgroundColor={COLORS.white_txt}
        barStyle="dark-content"
      />
      <ToolbarBackButton
        btnText={"Edit Profile"}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{ height: "100%", width: "100%", flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingBottom: 10,
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "white",
              justifyContent: "center",
              alignSelf: "center",
              height: 100,
              width: 100,
              borderRadius: 100 / 2,
              borderWidth: 1.5,
              borderColor: COLORS.light_pink,
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
                height: 90,
                width: 90,
                borderRadius: 90 / 2,
              }}
              activeOpacity={activeOpacity}
              onPress={() => {
                setIsImageSelectClick(true);
              }}
            >
              <FastImage
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 90 / 2,
                }}
                // source={
                //   fileUri_profile != ""
                //     ? { uri: fileUri_profile }
                //     : require("../assets/user_pro.png")
                // }
                source={
                  defaultImgSelect === true
                    ? { uri: fileUri_profile }
                    : profileImage != null &&
                      profileImage != undefined &&
                      profileImage != ""
                      ? {
                        uri: IMG_BASE_URL + profileImage,
                        priority: FastImage.priority.high,
                      }
                      : require("../assets/user_pro.png")
                }
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <TextCommonSemiBlod
            text={
              userData.fullname != undefined && userData.fullname != null
                ? userData.fullname
                : ""
            }
            color={COLORS.black_txt}
            fontSize={FONTS_SIZE.txt_16}
            fontWeight={"600"}
            marginTop={5}
            textAlign={"center"}
          />

          {/* <TouchableOpacity
                        activeOpacity={activeOpacity}
                        onPress={() => {
                            //getImgPermission();

                            if (fImages.length > 0) {
                                uploadProfileImages();
                            } else {
                                SnackBarCommon({ text: "Please select at least one image" });
                            }
                        }}
                        style={{
                            justifyContent: "center",
                            alignItems: "flex-end",
                            // marginTop: 5,
                            width: "95%",
                            height: 35,
                            //  backgroundColor: COLORS.colorGreen,
                            borderRadius: 5,
                            borderWidth: 0
                            // marginHorizontal: 10
                        }}
                    >
                        <Image
                            source={require("../assets/uplaod.png")}
                            resizeMode={"contain"}
                            style={{
                                width: 40,
                                height: 40
                            }}
                        />
                    </TouchableOpacity> */}

          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.bg_color,

              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 5,
              flexDirection: "row",
              height: 80,
            }}
          >
            <FlatList
              style={{ flex: 1 }}
              data={fImages}
              // numColumns={4}
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // paddingBottom: 2,
                // paddingTop: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: wp(100),
                    }}
                  >
                    <TextCommonMedium
                      text={"No data found"}
                      color={COLORS.black_txt}
                      fontSize={FONTS_SIZE.txt_14}
                      fontWeight={"500"}
                      marginTop={3}
                      textAlign={"center"}
                    />
                  </View>
                );
              }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={() => {
                      var newArr = [];

                      if (fImages.length > 0) {
                        fImages.forEach((element) => {
                          var obj = {
                            illustration: element.path,
                            type: element.type,
                          };
                          newArr.push(obj);
                        });
                      }

                      navigation.navigate("ImageDetailPage", {
                        // imgLink: item.path,
                        allDataItem: newArr,
                      });
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      //marginTop: 5,
                      width: 70,
                      height: 70,
                      borderRadius: 5,
                      borderWidth: 0,
                      marginHorizontal: 2,
                      backgroundColor: "orange",
                    }}
                  >
                    {item.type === "video" ? (
                      <Video
                        source={{
                          uri:
                            Platform.OS === "android"
                              ? item.isOnline === false
                                ? item.path.includes("file://")
                                  ? item.path
                                  : item.path.includes("content://")
                                    ? item.path
                                    : "file://" + item.path
                                : item.path
                              : item.path,
                        }}
                        resizeMode="stretch"
                        paused={true}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 5,
                        }}
                      />
                    ) : (
                      <FastImage
                        source={{
                          uri:
                            Platform.OS === "android"
                              ? item.isOnline === false
                                ? item.path.includes("file://")
                                  ? item.path
                                  : item.path.includes("content://")
                                    ? item.path
                                    : "file://" + item.path
                                : item.path
                              : item.path,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 5,
                          backgroundColor: "orange",
                        }}
                      />
                    )}

                    <TouchableOpacity
                      activeOpacity={activeOpacity}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        width: 20,
                        height: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: COLORS.color_transparent_black,
                        borderBottomLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}
                      onPress={() => {
                        if (
                          item.isOnline != undefined &&
                          item.isOnline != null
                        ) {
                          setDeleteIndex(index);
                          setShowAlertDelete(true);
                        }
                      }}
                    >
                      <Image
                        source={require("../assets/close_icon.png")}
                        resizeMode={"contain"}
                        style={{
                          width: 10,
                          height: 10,
                          tintColor: COLORS.color_red,
                        }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(_, index) => index.toString()}
            />

            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => {
                //getImgPermission();

                if (fImages.length > 0) {
                  if (fImages.length < 6) {
                    setImageMaxLimitForNow(6 - (fImages.length + 1));
                    getImgPermission();
                  } else {
                    SnackBarCommon({ text: "Image limit is only 5" });
                  }
                } else {
                  getImgPermission();
                }
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                // marginTop: 5,
                width: 40,
                height: 40,
                // backgroundColor: COLORS.colorGreen,
                borderRadius: 5,
                borderWidth: 0,
                marginHorizontal: 10,
              }}
            >
              <Image
                source={require("../assets/ic_add_photo_alternate_24px.png")}
                resizeMode={"contain"}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "90%",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            {accountView(
              "Full Name",
              "Enter full name",
              (newText) => setFullName(newText),
              full_name,
              "default",
              () => { },
              false
            )}

            {accountView(
              "Mobile Number",
              "Enter mobile number",
              (newText) => setNumber(newText),
              number,
              "null",
              () => { },
              false
            )}
            {accountView(
              "Email",
              "Enter email",
              (newText) => setEmail(newText),
              email,
              "email-address",
              () => { },
              false
            )}
            {accountView(
              "Birth Date",
              "Enter birth date",
              (newText) => setBirthDate(newText),
              birth_date != ""
                ? moment(birth_date).format(dateDisplayFormate)
                : "",
              "null",
              () => {
                setIsDatePickerVisible(true);
              },
              false
            )}
            {accountView(
              "About",
              "Enter about",
              (newText) => setAbout(newText),
              about,
              "default",
              () => { },
              true
            )}

            <View
              style={{
                // width: "100%",
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderColor: COLORS.very_light_grey,
                backgroundColor: COLORS.white_txt,
                marginTop: 15,
                marginHorizontal: 0,
                // elevation: 1
              }}
            >
              <TouchableOpacity
                style={{
                  // width: "50%",
                  flex: 1,
                  height: 45,
                  borderColor:
                    gender === 1 ? COLORS.primary : COLORS.white_original,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: gender === 1 ? 0.5 : 0,
                  borderBottomLeftRadius: 5,
                  borderTopLeftRadius: 5,
                }}
                // onPress={() => {
                //   setMale(true);
                //   setFemale(false);
                // }}
                onPress={() => setGender(1)}
                visible={gender}
              >
                <Text
                  style={{
                    color:
                      gender === 1 ? COLORS.black_txt : COLORS.gry_text,
                    fontSize: FONTS_SIZE.txt_15,
                    fontFamily: FONTS.FontRegular,
                  }}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  // width: "50%",
                  height: 45,
                  borderColor:
                    gender != 1
                      ? COLORS.primary
                      : COLORS.white_original,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: gender != 1 ? 0.5 : 0,
                  borderBottomRightRadius: 5,
                  borderTopRightRadius: 5,
                }}
                // onPress={() => {
                //   setMale(false);
                //   setFemale(true);
                // }}
                onPress={() => setGender(2)}
                visible={gender}
              >
                <Text
                  style={{
                    color:
                      gender != 1 ? COLORS.black_txt : COLORS.gry_text,
                    fontSize: FONTS_SIZE.txt_15,
                    fontFamily: FONTS.FontRegular,
                  }}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 20,
              }}
            >
              <ButtonView
                backgroundColor={COLORS.colorGreen}
                btnText={"Update"}
                btntxColor={COLORS.white_txt}
                borderColor={COLORS.colorGreen}
                onPress={() => onUpdateClick()}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {isDatePickerVisible === true ? (
        <View
          style={{
            backgroundColor: COLORS.bg_color,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          {Platform.OS === "ios" ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                marginTop: 5,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 5,
                }}
              >
                <TextCommonregular
                  text={"Cancel"}
                  onClickText={() => {
                    setIsDatePickerVisible(false);
                  }}
                  color={COLORS.primary}
                  fontSize={FONTS_SIZE.txt_12}
                  fontWeight={"500"}
                  height={19}
                />
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 5,
                }}
              >
                <TextCommonregular
                  text={"Confirm"}
                  onClickText={() => {
                    setIsDatePickerVisible(false);
                  }}
                  color={COLORS.primary}
                  fontSize={FONTS_SIZE.txt_12}
                  fontWeight={"500"}
                  height={19}
                />
              </View>
            </View>
          ) : null}

          <DateTimePicker
            value={birth_date === "" ? new Date() : new Date(birth_date)}
            mode={"date"}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={false}
            onChange={onDateSelected}
            maximumDate={new Date()}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>
      ) : null}

      <ImagePickerCommon
        onImageSelectDone={onImageSelectDone}
        onImageSelectOpen={isImageSelectClick}
        setIsImageSelectClick={setIsImageSelectClick}
      />

      <Modal
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        backdropOpacity={0.9}
        backdropColor={COLORS.black_txt}
        isVisible={isCameraDialogVisible}
        onBackdropPress={() => toggleModal()}
        onSwipeComplete={() => toggleModal()}
        swipeDirection="right"
        useNativeDriver={false}
        hideModalContentWhileAnimating={true}
      >
        <View style={styles.modalView}>
          <View style={styles.modalBgView}>
            <Text style={styles.modalTitle_selected}>
              Select Image and Video
            </Text>

            <View style={styles.modalDivider} />
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onMultipleVide()}
            >
              <Text style={styles.modelGallery}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleModal()}
              style={{
                alignSelf: "center",
                width: "90%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 10,
                backgroundColor: COLORS.colorGreen,
                marginTop: 10,
              }}
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LogoutDialog
        loading={showAlertDelete}
        msg_text={"Do you really want to delete?"}
        leftButtonText={"CANCEL"}
        rightButtonText={"DELETE"}
        onPressRightButton={() => {
          setShowAlertDelete(false);
          if (deleteIndex >= 0) {
            // if (fImages[deleteIndex].isOnline === true) {
            //   setRemoveIds(removeIds + fImages[deleteIndex].id + ",");
            // }
            // var array = [...fImages];
            // array.splice(deleteIndex, 1);
            // setFImages(array);

            deleteUserImage(fImages[deleteIndex].id);
          }
        }}
        onPressLeftButton={() => setShowAlertDelete(false)}
      />

      <Loader loading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    // shadowColor: COLORS.COLOR.colorWhite,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.84,
    justifyContent: "center",
  },

  modalBgView: {
    backgroundColor: COLORS.white_txt,
    borderRadius: 10,
    height: 250,
    width: 330,
  },

  modalTitle_selected: {
    fontFamily: FONTS.FontMedium,
    color: COLORS.black_txt,
    fontSize: FONTS_SIZE.txt_16,
    textAlign: "center",
    padding: wp(6),
  },
  modalTitle: {
    fontFamily: FONTS.FontRegular,
    color: COLORS.black_txt,
    fontSize: FONTS_SIZE.txt_14,
    textAlign: "center",
    padding: wp(6),
  },

  modelCamera: {
    fontFamily: FONTS.FontRegular,
    color: COLORS.black_txt,
    fontSize: FONTS_SIZE.txt_14,
    textAlign: "center",
    backgroundColor: COLORS.white_txt,
    padding: wp(5),
  },

  modelGallery: {
    fontFamily: FONTS.FontRegular,
    color: COLORS.black_txt,
    fontSize: FONTS_SIZE.txt_14,
    textAlign: "center",
    backgroundColor: COLORS.white_txt,
    padding: wp(3),
  },

  modalDivider: {
    width: "90%",
    height: wp(0.1),
    backgroundColor: COLORS.gry_text,
    alignItems: "center",
    alignSelf: "center",
  },

  modalCancel: {
    padding: wp(3),
    fontSize: FONTS_SIZE.txt_14,
    color: COLORS.white_original,
    fontFamily: FONTS.FontSemiBold,
    textAlign: "center",
  },
});

export default UserEditProfilePage;
