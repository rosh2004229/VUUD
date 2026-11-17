import React, { useEffect, useState, useRef } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-crop-picker";
import { COLORS, FONTS, FONTS_SIZE } from "./utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function ImagePickerCommon({
  optionsM,
  onImageSelectDone,
  onImageSelectOpen,
  setIsImageSelectClick,
}) {
  const [isCameraDialogVisible, setIsCameraDialogVisible] = useState(false);

  useEffect(() => {
    if (onImageSelectOpen === true) {
      getImgPermission();
    }
    console.log({ onImageSelectOpen });
  }, [onImageSelectOpen]);

  const hasCameraPermission = async () => {
    if (Platform.OS === "ios") {
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

  const selectPhotoTapped = () => {
    var options =
      optionsM != undefined || optionsM != null
        ? optionsM
        : {
          width: 500,
          height: 500,
          cropping: true,
          includeBase64: true,
          compressImageQuality: 0.5,
          compressImageMaxHeight: 500,
          compressImageMaxWidth: 500,
          mediaType: "photo",
        };
    ImagePicker.openPicker(options)
      .then((data) => {
        toggleModal();
        console.log({
          data,
        });
        const fileNameArray = data.path.split("/");
        const fileName = fileNameArray[fileNameArray.length - 1];
        const typeM = data.mime;
        const uri = data.path;
        const selected = [
          {
            fileName: fileName,
            typeM: typeM,
            uri:
              Platform.OS === "ios"
                ? uri
                : uri.includes("file://")
                  ? uri
                  : "file://" + uri,
          },
        ];
        toggleModal();
        onImageSelectDone(selected);
      })
      .catch((err) => {
        // alert(err);
        console.log("errrrrrrrrrrrrr--------", err);

      });
  };

  const cameraClick = () => {
    console.log('dddddddddddddddddd');
    var options =
      optionsM != undefined || optionsM != null
        ? optionsM
        : {
          width: 500,
          height: 500,
          cropping: true,
          includeBase64: true,
          compressImageQuality: 0.5,
          compressImageMaxHeight: 500,
          compressImageMaxWidth: 500,
          mediaType: "photo",
        };

    console.log('eeeeeeeeeeeeeeeeeeeeeeeee', options);

    ImagePicker.openCamera(options)
      .then((data) => {
        console.log('bbbbbbbbbbbbbbbbbbbbb', data);
        toggleModal();
        const fileNameArray = data.path.split("/");
        const fileName = fileNameArray[fileNameArray.length - 1];
        const typeM = data.mime;
        const uri = data.path;
        const selected = [
          {
            fileName: fileName,
            typeM: typeM,
            uri:
              Platform.OS === "ios"
                ? uri
                : uri.includes("file://")
                  ? uri
                  : "file://" + uri,
          },
        ];
        toggleModal();

        console.log('cccccccccccccc', selected);
        onImageSelectDone(selected);
      })
      .catch((err) => {
        // alert(err);
        console.log("errrrrrrrrrrrrr11--------", err);
      });
  };

  return (
    <View>
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
            <Text style={styles.modalTitle_selected}>Select Image</Text>
            <View style={styles.modalDivider} />
            <TouchableOpacity
              style={{
                padding: hp(2),
              }}
              activeOpacity={0.9}
              onPress={() => cameraClick()}
            >
              <Text style={styles.modelCamera}>Take photo</Text>
            </TouchableOpacity>
            <View style={styles.modalDivider} />
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                padding: hp(2),
              }}
              onPress={() => selectPhotoTapped()}
            >
              <Text style={styles.modelGallery}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setIsImageSelectClick(false);
                toggleModal();
              }}
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
    paddingTop: 10,
    paddingBottom: 10,
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
  },

  modelGallery: {
    fontFamily: FONTS.FontRegular,
    color: COLORS.black_txt,
    fontSize: FONTS_SIZE.txt_14,
    textAlign: "center",
    backgroundColor: COLORS.white_txt,
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
    color: COLORS.white_txt,
    fontFamily: FONTS.FontSemiBold,
    textAlign: "center",
  },
});

export default ImagePickerCommon;
