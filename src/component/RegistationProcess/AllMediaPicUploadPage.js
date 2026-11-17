import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  PermissionsAndroid,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import ButtonView from "../../common/ButtonView";
import Loader from "../../common/LoadingScreen";
import TextCommonMedium from "../../common/TextCommonMedium";
import TextInputView from "../../common/TextInputView";
import { BASE_URL, COLORS, FONTS, FONTS_SIZE, activeOpacity } from "../../common/utils";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import ToolbarBackButton from "../../common/ToolbarBackButton";
import TextCommonregular from "../../common/TextCommonregular";
import Modal from "react-native-modal";
import SnackBarCommon from "../../common/SnackBarCommon";
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import { requestMultiple, PERMISSIONS } from "react-native-permissions";
import InternetPermission from "../../common/InternetPermission";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIWebCall from "../../common/APIWebCall";
import statusView from "../../common/statusView";
import FastImage from "react-native-fast-image";
import Video from 'react-native-video';
import { useFocusEffect } from "@react-navigation/native";

let { width, height } = Dimensions.get("window");
let boxCount = 2;
let boxWidth = width / boxCount;

var temp = [];
var count = 0;
function AllMediaPicUploadPage({ navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [statusProgressCount, setStatusProgressCount] = useState(6);
  const [isCameraDialogVisible, setIsCameraDialogVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [imageMaxLimitForNow, setImageMaxLimitForNow] = useState(4);
  const [fImages, setFImages] = useState([
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ]);
  const [imagesLive, setImagesLive] = useState([]);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [removeIds, setRemoveIds] = useState("");
  const [selectedImagePathArr, setSelectedImagePathArr] = useState([]);
  const [SelectedIndex, setSelectedIndex] = useState(null);

  const [imagesPlaceholders, setImagesPlaceholders] = useState([
    { image: require("../../assets/ic_add_photo_alternate_24px.png") },
    { image: require("../../assets/ic_add_photo_alternate_24px.png") },
    { image: require("../../assets/ic_add_photo_alternate_24px.png") },
    { image: require("../../assets/ic_add_photo_alternate_24px.png") },
  ]);



  useFocusEffect(
    React.useCallback(() => {
      count = 0;
      temp = [];

    }, [])
  );



  const onNextClick = async () => {
    count = 0;

    var isValidation = fImages.map((item) => {
      if (item.fileName != undefined) {
        count++;
      }
    });
    if (count < 2) {
      showMessage({
        message: "Upload Minimum Two Media Images",
        type: "danger",
      });
    } else {
      uploadProfileImages(fImages);
    }
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

  const bytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2); // Return result rounded to 2 decimal places
  };

  const onMultipleVide = async () => {
    try {
      const singleSelectedMode = true;
      // toggleModal();
      const response = await MultipleImagePicker.openPicker({
        // selectedAssets: images,
        isExportThumbnail: true,
        //maxVideo: 2,

        doneTitle: "Done",
        maxSelectedAssets: imageMaxLimitForNow,
        usedCameraButton: false,
        isCrop: true,
        isCropCircle: false,
        selectedColor: "#154293",
        singleSelectedMode,
        mediaType: "all",
      });

      const megabyteValue = bytesToMB(response.size);
      var mbValue = parseInt(megabyteValue);

      if (mbValue > 5) {
        setIsCameraDialogVisible(false);
        setTimeout(() => {
          alert("Media size should be less than 5 MB. Please try another one.");
        }, 300);
      } else {
        if (response != undefined) {
          count++;
          var obj = {
            ...response,
          };
          temp.push(obj);
        }

        var array = [...fImages];
        var obj = array[SelectedIndex];
        obj.fileName = response.fileName;
        obj.path = response.realPath != undefined ? response.realPath : response.path;
        obj.type = response.type;
        obj.mime = response.mime;
        obj.isOnline = false;

        var newArr = [];
        newArr.push(obj);

        console.log("ffffffffffffffffffffffffffffffffffffffffffff", obj);

        setTimeout(() => {
          toggleModal();
        }, 500);

        setFImages([...obj]);
      }

      //   if (response != undefined) {
      //     temp.push(response);
      //   }

      //   // toggleModal();

      //   let outputArray = temp.map((item, index) => {
      //     return {
      //       fileName: item.fileName,
      //       path: item.path,
      //       type: item.type,
      //       id: index,
      //     };
      //   });

      //   if (fImages.length > 0) {
      //     const updatedArray = fImages.map((item, index) => {
      //       const selectedItem = outputArray.flat().find((selected) => {
      //         if (selected.fileName === item.fileName) return selected;
      //       });
      //       // console.log({ selectedItem });
      //       if (selectedItem) {
      //         return { ...selectedItem };
      //       }
      //       if (index === 0 && fImages.length > 0) {
      //         if (outputArray[0].fileName === undefined) {
      //           console.log('66666666');

      //           return outputArray[0];
      //         }
      //       }

      //       return item;
      //     });
      //     count++;
      //     setFImages(updatedArray);
      //   }

      //   setTimeout(() => {
      //     toggleModal();
      //   }, 500);
    } catch (e) { }
  };

  const uploadProfileImages = async (images) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var user_id = await AsyncStorage.getItem("user_id");
      setisLoading(true);

      var data = new FormData();
      data.append("user_id", user_id);
      data.append("step", 6);

      if (images.length > 1) {
        for (let index1 = 0; index1 < images.length; index1++) {
          const element_value = images[index1];
          console.log({ element_value });
          if (
            element_value.fileName != undefined ||
            element_value.fileName != null
          ) {
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
            console.log({ new_profile });
            data.append("profile_image[" + (index1 + 1) + "]", new_profile);
            data.append("type[" + (index1 + 1) + "]", element_value.type);
          }
        }
      }
      console.log("All media =====> ", JSON.stringify(data));
      onUploadImagesAPICall(data);
    }
  };

  const onUploadImagesAPICall = (data) => {
    console.log("[AllMediaPicUploadPage] addMultiplemediapic API Triggered");
    console.log("[AllMediaPicUploadPage] Endpoint: addMultiplemediapic");
    console.log("[AllMediaPicUploadPage] Full URL:", BASE_URL + "addMultiplemediapic");
    console.log("[AllMediaPicUploadPage] Payload: Media items uploading for Step 6");
    APIWebCall.addMultiplemediapicAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("[AllMediaPicUploadPage] addMultiplemediapic Response:", response);
        navigation.navigate("KeywordAddPage");
      })
      .catch((err) => {
        console.log("[AllMediaPicUploadPage] addMultiplemediapic Error:", err);
        console.log("err========> ", err);
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => setisLoading(false));
  };

  // const deleteUserImage = async (imageId) => {
  //   var data = new FormData();
  //   data.append('id', imageId);

  //   onProfileImagesDeleteAPICall(data);
  // };

  // const onProfileImagesDeleteAPICall = (data) => {
  //   APIWebCall.onProfileImagesDeleteAPICall(data)
  //     .then(async (response) => {
  //       setisLoading(false);

  //       if (fImages[deleteIndex].isOnline === true) {
  //         setRemoveIds(removeIds + fImages[deleteIndex].id + ',');
  //       }
  //       var array = [...fImages];
  //       array.splice(deleteIndex, 1);
  //       setFImages(array);
  //     })
  //     .catch((err) => {
  //       console.log('err========> ', err);
  //       setisLoading(false);
  //       SnackBarCommon({ text: err });
  //     })
  //     .finally(() => setisLoading(false));
  // };

  const deleteImages = async (index, item) => {
    var array = [];
    fImages.forEach((element, idx) => {
      if (index === idx) {
        array.push({ id: idx });
      } else {
        array.push(element);
      }
    });
    count--;
    // temp = temp.splice(index, 1);

    setFImages(array);
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
          btnText={"Media Images"}
          onBackPress={() => navigation.goBack()}
        />
        <View
          style={{ marginLeft: 10, marginRight: 10, marginTop: 5, flex: 1 }}
        >
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

          <FlatList
            style={{ flex: 1 }}
            keyboardShouldPersistTaps={"always"}
            data={fImages}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              alignItems: "center",
            }}
            renderItem={({ item, index }) => {
              console.log({ item });
              return (
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={() => {
                    if (count >= 4) {
                      showMessage({
                        message: "Maximum four media files can be uploaded",
                        type: "danger",
                      });
                    } else {
                      setSelectedIndex(index);
                      getImgPermission();
                    }
                  }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    //marginTop: 5,
                    width: boxWidth - 20,
                    height: 200,
                    borderRadius: 8,
                    borderWidth: 0.5,
                    marginHorizontal: 5,
                    marginTop: 12,
                    backgroundColor: COLORS.very_light_grey,
                    borderColor: COLORS.border_color,
                  }}
                >
                  {item.fileName != undefined ? (
                    item.type === "video" ? (
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
                          width: boxWidth - 20,
                          height: 200,
                          borderRadius: 8,
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
                          width: boxWidth - 20,
                          height: 200,
                          borderRadius: 8,
                        }}
                      />
                    )
                  ) : null}

                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    style={{
                      position: "absolute",
                      right: -5,
                      top: 180,
                      width: 28,
                      height: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        item.fileName != undefined
                          ? COLORS.very_light_orange
                          : COLORS.yellow_light,
                      borderRadius: 30,
                      borderColor:
                        item.fileName != undefined
                          ? COLORS.gry_light
                          : COLORS.yellow_light,
                      borderWidth: 0.6,
                    }}
                    onPress={() => {
                      if (item.fileName != undefined) {
                        deleteImages(index, item);
                      }
                      // if (
                      //   item.isOnline != undefined &&
                      //   item.isOnline != null
                      // ) {
                      //   setDeleteIndex(index);
                      //   setShowAlertDelete(true);
                      // }
                    }}
                  >
                    <Image
                      source={
                        item.fileName != undefined
                          ? require("../../assets/close_icon.png")
                          : require("../../assets/add_icon.png")
                      }
                      resizeMode={"contain"}
                      style={{
                        width: 10,
                        height: 10,
                        tintColor:
                          item.fileName != undefined
                            ? COLORS.color_red
                            : COLORS.white_original,
                      }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
            //   ListEmptyComponent={() => {
            //     return isLoading === false ? (
            //       <ListEmptyView txt={'No data found'} />
            //     ) : null;
            //   }}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
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
        <Loader loading={isLoading} />
      </View>
    </ImageBackground>
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
export default AllMediaPicUploadPage;
