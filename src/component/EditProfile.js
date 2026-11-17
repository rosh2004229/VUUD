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
  BackHandler,
  Keyboard,
  Dimensions,
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
  generateUUID,
  getInstagramFollowers,
  kFormatter,
  kFormatterYoutube,
} from "../common/utils";
import Snackbar from "react-native-snackbar";
import APIWebCall from "../common/APIWebCall";
import NetInfo from "@react-native-community/netinfo";
import Loader from "../common/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InternetPermission from "../common/InternetPermission";
import { StackActions } from "@react-navigation/native";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
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
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import { requestMultiple, PERMISSIONS } from "react-native-permissions";

// import {
//   // @ts-ignore
//   openPicker
// } from "@baronha/react-native-multiple-image-picker";
import LogoutDialog from "../common/LogoutDialog";
import { useFocusEffect } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import CommonApiCall from "../common/CommonApiCall";
import Video from 'react-native-video';
import LinearGradient from "react-native-linear-gradient";

let { width, height } = Dimensions.get("window");
let boxCount = 2;
let boxWidth = width / boxCount;

function EditProfilePage({ navigation }) {
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [number, setNumber] = useState("");
  const [full_name, setFullName] = useState("");
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [category, setCategory] = useState("");
  const [male, setMale] = useState(true);
  const [female, setFemale] = useState(false);
  const [gender, setGender] = useState(1);

  const [about, setAbout] = useState("");
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
  const [profilePhoto, setProfilePhoto] = useState("");

  const [isLoading, setisLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isImageSelectClick, setIsImageSelectClick] = useState(false);

  const [socialView, setSocialView] = useState(false);
  const [mediaView, setMediaView] = useState(false);
  const [personalView, setPersonalView] = useState(true);

  const [keywordView, setKeywordView] = useState(false);

  const [twitterID, settwitterId] = useState("");
  const [isCameraDialogVisible, setIsCameraDialogVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [imageMaxLimitForNow, setImageMaxLimitForNow] = useState(5);
  const [fImages, setFImages] = useState([
    {
      id: "",
      isOnline: "",
      path: "",
      type: "",
    },
    {
      id: "",
      isOnline: "",
      path: "",
      type: "",
    },
    {
      id: "",
      isOnline: "",
      path: "",
      type: "",
    },
    {
      id: "",
      isOnline: "",
      path: "",
      type: "",
    },
    {
      id: "",
      isOnline: "",
      path: "",
      type: "",
    },
  ]);
  const [imagesLive, setImagesLive] = useState([]);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [removeIds, setRemoveIds] = useState("");
  const [userData, setUserData] = useState({});

  const [instagram_followers, setInstagramFollowers] = useState(0);

  const [youTube_Suscriber_Count, setYouTube_Suscriber_Count] = useState("0");
  const [youTube_Suscriber_Pass_API, setYouTube_Suscriber_Pass_API] =
    useState("0");
  const [youTube_getSub_Error, setYouTube_getSub_Error] = useState(null);
  const [youtube_id, setYouTubeId] = useState("");

  const [city, setCity] = useState("");
  const [city_id, setCity_id] = useState("");

  const [country, setCountry] = useState("");
  const [country_id, setCountry_id] = useState("");

  const [selectedHashValuesArr, setSelectedHashValueArr] = useState([]);
  const [hashTagText, setHashTagText] = useState("");

  const [instagram_followers_Error, setInstagramFollowersError] =
    useState(null);

  const [SelectedIndex, setSelectedIndex] = useState(null);
  const [imgCount, setImgCount] = useState(0);


  useEffect(() => {
    getData();
    setCity("");
    setCountry("");
    setCity_id();
    setCountry_id();
    setListInView();
  }, []);

  useFocusEffect(
    useCallback(() => {
      onGetData();
      analyticsLog("EditProfile_screen");
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
      return () => {
        subscription.remove();
      };
    }, [])
  );

  const handleBackButtonClick = async () => {
    removeDb_key();
    return true;
  };

  const removeDb_key = async () => {
    AsyncStorage.removeItem("selected_keyword_ayy");
    AsyncStorage.removeItem("selectFilterCity_edit");
    AsyncStorage.removeItem("city_id_edit");
    AsyncStorage.removeItem("city_edit");
    AsyncStorage.removeItem("selectFilterCountry_edit");
    AsyncStorage.removeItem("country_id_edit");
    AsyncStorage.removeItem("country_edit");
    navigation.goBack(null);
  };
  const onGetData = async () => {
    // set City
    const city_id_bd = await AsyncStorage.getItem("city_id_edit");
    if (city_id_bd != undefined) {
      setCity_id(city_id_bd.toString());
    }
    const city_bd = await AsyncStorage.getItem("city_edit");
    if (city_bd != undefined) {
      setCity(city_bd.toString());
    }
    // set Country
    const country_id_bd = await AsyncStorage.getItem("country_id_edit");
    if (country_id_bd != undefined) {
      setCountry_id(country_id_bd.toString());
    }
    const country_bd = await AsyncStorage.getItem("country_edit");
    if (country_bd != undefined) {
      setCountry(country_bd.toString());
    }
  };

  const getData = async () => {
    var user_id = await AsyncStorage.getItem("user_id");
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    if (isInternetGranted == true) {
      setisLoading(true);
      var data = new FormData();
      data.append("user_id", user_id);

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
          response.data.user.registrationcategory != null &&
          response.data.user.registrationcategory != undefined &&
          response.data.user.registrationcategory.length > 0
        ) {
          const categoryNames = response.data.user.registrationcategory.map(
            (category) => {
              if (
                category.category != null &&
                category.category != undefined &&
                category.category.category_name != null
              ) {
                return category.category.category_name;
              }
            }
          );
          const output = categoryNames.join(" " + "," + " ");
          setCategory(output);
        }

        if (
          response.data.user.birthdate != null &&
          response.data.user.birthdate != undefined
        ) {
          setBirthDate(response.data.user.birthdate);
        }

        if (
          response.data.user.gender != null &&
          response.data.user.gender != undefined
        ) {
          setGender(response.data.user.gender);
        }

        if (
          response.data.user.instagram_count != null &&
          response.data.user.instagram_count != undefined
        ) {
          setInstagramFollowers(response.data.user.instagram_count);
        }

        if (
          response.data.user.youtube_count != null &&
          response.data.user.youtube_count != undefined
        ) {
          setYouTube_Suscriber_Count(response.data.user.youtube_count);
          setYouTube_Suscriber_Pass_API(response.data.user.youtube_count);
        }

        if (
          response.data.user.city != null &&
          response.data.user.city != undefined
        ) {
          setCity(response.data.user.city.city);
          setCity_id(response.data.user.city.id);
        }
        if (
          response.data.user.country != null &&
          response.data.user.country != undefined
        ) {
          setCountry(response.data.user.country.name);
          setCountry_id(response.data.user.country.id);
        }

        if (
          response.data.user.about != null &&
          response.data.user.about != undefined
        ) {
          setAbout(response.data.user.about);
        }

        if (
          response.data.user.website_url != null &&
          response.data.user.website_url != undefined
        ) {
          setWebsiteUrl(response.data.user.website_url);
        }

        if (
          response.data.user.company_name != null &&
          response.data.user.company_name != undefined
        ) {
          setCompanyName(response.data.user.company_name);
        }

        // if (response.data.user != undefined) {
        //   AsyncStorage.removeItem('selected_keyword_ayy');
        //   navigation.navigate('UserProfilePage');
        //   setTimeout(() => {
        //     showMessage({
        //       message: response.message,
        //       type: 'success',
        //     });
        //   }, 120);
        // }

        if (
          response.data.user.instagram_username != null &&
          response.data.user.instagram_username != undefined
        ) {
          setInstagramId(response.data.user.instagram_username);
        }
        if (
          response.data.user.youtube_username != null &&
          response.data.user.youtube_username != undefined
        ) {
          setYouTubeId(response.data.user.youtube_username);
        }

        if (
          response.data.user.image != null &&
          response.data.user.image != undefined
        ) {
          setProfilePhoto(response.data.user.image);
        }

        if (
          response.data.user.profile_image != null &&
          response.data.user.profile_image != undefined
        ) {
          if (response.data.user.profile_image.length > 0) {
            setImgCount(response.data.user.profile_image.length);
            // AsyncStorage.setItem(
            //   'user_profile_pic',
            //   response.data.user.profile_image[0].image.toString()
            // );

            var temp = [...fImages];

            response.data.user.profile_image.forEach((element, indx) => {
              var objImg = {
                id: element.id,
                path: element.image != null ? IMG_BASE_URL + element.image : "",
                isOnline: true,
                type: element.type,
              };
              // fImages[indx]
              temp[indx];
              temp[indx].id = element.id;
              temp[indx].path =
                element.image != null ? IMG_BASE_URL + element.image : "";
              temp[indx].isOnline = true;
              temp[indx].type = element.type;
              // temp.push(objImg);
            });

            setFImages(temp);
          }
        }

        var keyword_Ayy = [];
        if (
          response.data.user != undefined &&
          response.data.user.regihashtag != null &&
          response.data.user.regihashtag.length > 0
        ) {
          if (response.data.user.regihashtag.length > 0) {
            response.data.user.regihashtag.forEach((element) => {
              var obj = {
                hashtag_name: element.hashtag,
                id: element.hashtag.id,
              };
              keyword_Ayy.push(obj);
            });
          }
        }

        setSelectedHashValueArr(keyword_Ayy);
      })
      .catch((err) => {
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const goToSelectionPage = (title) => {
    if (title === "City") {
      navigation.navigate("SelectCityPage", {
        title: title,
      });
    } else {
      navigation.navigate("SelectCountryPage", {
        title: title,
      });
      // navigation.navigate('SelectKeywordPage', {
      //   title: title,
      //   selectedValuesArr,
      // });
    }
  };

  const filterItemView = (lable, value) => {
    return (
      <TouchableOpacity
        onPress={() => goToSelectionPage(lable)}
        activeOpacity={activeOpacity}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          paddingVertical: 15,
          paddingHorizontal: 10,
          width: "100%",
          height: 65,
          marginVertical: 5,
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: -2, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextCommonMedium
          text={value}
          color={COLORS.black_txt}
          fontSize={FONTS_SIZE.txt_14}
          fontWeight={"500"}
          width={wp(74.5)}
          marginLeft={1}
        />

        <Image
          source={require("../assets/next.png")}
          style={{
            width: 15,
            height: 15,
            position: "absolute",
            right: 15,
            tintColor: COLORS.gry_text,
          }}
        />
      </TouchableOpacity>
    );
  };

  const getInstagramFollowers = () => {
    setInstagramFollowersError(null);
    setisLoading(true);
    axios
      .create({
        headers: {
          "user-agent":
            "Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)",
        },
      })
      .get(
        "https://i.instagram.com/api/v1/users/web_profile_info/?username=" +
        instagram_id
      )
      .then((res) => {
        try {
          // setInstagramFollowers(
          //   kFormatter(res.data.data.user.edge_followed_by.count)
          // );
          console.log(
            "res.data.data.user.edge_followed_by.count====> ",
            res.data.data.user.edge_followed_by.count
          );
          setInstagramFollowers(res.data.data.user.edge_followed_by.count);
          setInstagramFollowersError(null);

          setTimeout(() => {
            updateInstaCount(res.data.data.user.edge_followed_by.count);
          }, 300);
        } catch (error) {
          console.log("error ====> ", error);
          setInstagramFollowers(0);
          setInstagramFollowersError(
            "Please try later instagram server is not responding right now."
          );
        }
      })
      .catch((err) => {
        console.log("error:\n" + err);
        setInstagramFollowersError("Instagram id does not found");
      })
      .finally(() => {
        console.log("end");
        setisLoading(false);
      });
  };

  const getYoutubeSub = async () => {
    setYouTube_getSub_Error(null);
    setisLoading(true);
    const API_KEY = "AIzaSyDdHVhQHMXeGZGtDftGEw3RBLa3OtGKSd4";
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
      console.log({ subscriberCount });
      setYouTube_Suscriber_Count(subscriberCount);
      setYouTube_Suscriber_Pass_API(subscriberCount);
      setisLoading(false);
    } catch (error) {
      console.error("Error fetching subscriber count:", error);
      setYouTube_Suscriber_Count(kFormatter(0));
      setisLoading(false);
      setYouTube_getSub_Error("Youtube channel does not found.");
    }
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
      showMessage({
        message: "Enter Name",
        type: "danger",
      });
    } else if (email === "") {
      showMessage({
        message: "Enter Email",
        type: "danger",
      });
    } else if (birth_date === "") {
      showMessage({
        message: "Enter birth date",
        type: "danger",
      });
    } else if (category === "") {
      showMessage({
        message: "Enter Category",
        type: "danger",
      });
    } else if (city === "") {
      showMessage({
        message: "Select city ",
        type: "danger",
      });
    } else if (country === "") {
      showMessage({
        message: "Enter country ",
        type: "danger",
      });
    } else if (about === "") {
      showMessage({
        message: "Enter about",
        type: "danger",
      });
    } else if (gender === "") {
      showMessage({
        message: "Select Gender",
        type: "danger",
      });
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

      data.append("city_id", city_id.toString());
      data.append("country_id", country_id.toString());
      // data.append('country', country);
      data.append("about", about);
      data.append("instagram_username", instagram_id);
      data.append("youtube_username", youtube_id);
      data.append("twitter_username", twitterID);
      data.append("linkedin_username", linkedInName);
      data.append("facebook_username", facebook_id);
      data.append("pinterest_username", pinterestName);
      data.append("company_name", company_name);
      data.append("website_url", website_url);
      data.append("gender", gender);
      data.append("youtube_count", youTube_Suscriber_Pass_API);
      data.append("instagram_count", instagram_followers);

      if (selectedHashValuesArr.length > 0) {
        selectedHashValuesArr.forEach((element) => {
          data.append("regihashtag[]", element.hashtag_name);
        });
      } else {
        data.append("regihashtag[]", null);
      }
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
          removeDb_key();
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

  const bytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2); // Return result rounded to 2 decimal places
  };

  const onMultipleVide = async () => {
    // const response = await MultipleImagePicker.openPicker({
    //   selectedAssets: images,
    //   isExportThumbnail: true,
    //   maxSelectedAssets: imageMaxLimitForNow,
    //   usedCameraButton: false,
    //   isCrop: true,
    //   isCropCircle: true,
    //   selectedColor: "#154293"
    // });

    try {
      const singleSelectedMode = true;
      // toggleModal();

      const response = await MultipleImagePicker.openPicker({
        // selectedAssets: images,
        isExportThumbnail: true,
        //maxVideo: 2,
        mediaType: "all",
        maxVideoDuration: 30,
        doneTitle: "Done",
        maxSelectedAssets: imageMaxLimitForNow,
        usedCameraButton: false,
        isCrop: true,
        isCropCircle: false,
        selectedColor: "#154293",
        singleSelectedMode,
      });
      // toggleModal();

      // for (let index = 0; index < temp.length; index++) {
      //   temp[index].isOnline = false;
      // }

      const megabyteValue = bytesToMB(response.size);
      var mbValue = parseInt(megabyteValue);
      if (mbValue > 5) {
        setIsCameraDialogVisible(false);
        setTimeout(() => {
          alert("Media size should be less than 5 MB. Please try another one.");
        }, 300);
      } else {
        setIsCameraDialogVisible(false);
        var temp = [...fImages];
        temp[SelectedIndex];
        temp[SelectedIndex].path =
          response.realPath != undefined ? response.realPath : response.path;
        temp[SelectedIndex].isOnline = false;
        temp[SelectedIndex].type = response.type;
        setImages(temp);
        setTimeout(() => {
          uploadProfileImages(response);
        }, 500);
      }

      // console.log('image response ====> ', JSON.stringify(response));
      // if (fImages.length > 0) {
      //   setFImages([...fImages, ...temp]);
      // } else {
      //   setFImages([...temp]);
      // }
    } catch (e) { }
  };

  const uploadProfileImages = async (images) => {
    toggleModal();
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var user_id = await AsyncStorage.getItem("user_id");
      setisLoading(false);

      var data = new FormData();
      const element = images;
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
        getData();
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

        //  getData();

        if (fImages[deleteIndex].isOnline === true) {
          setRemoveIds(removeIds + fImages[deleteIndex].id + ",");
        }
        var array = [...fImages];
        // array.splice(deleteIndex, 1);

        array[deleteIndex];
        array[deleteIndex].id = "";
        array[deleteIndex].path = "";
        array[deleteIndex].isOnline = "";
        array[deleteIndex].type = "";

        if (imgCount > 0) {
          let count = imgCount - 1;
          setImgCount(count);
        } else {
          setImgCount(0);
        }
        setFImages(array);
      })
      .catch((err) => {
        console.log("err========> ", err);
        setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(() => setisLoading(false));
  };

  const updateInstaCount = async (instagram_count) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      var user_id = await AsyncStorage.getItem("user_id");
      // setisLoading(true);
      var data = new FormData();
      // data.append('instagram_count', instagram_followers);
      data.append("instagram_count", instagram_count);
      data.append("user_id", user_id);

      onInstaUpdateCountAPICall(data);
    }
  };

  const onInstaUpdateCountAPICall = (data) => {
    APIWebCall.onUpdateInstaCountAPICall(data)
      .then(async (response) => {
        // setisLoading(false);
        setTimeout(() => {
          SnackBarCommon({ text: response.message, isSuccess: true });
        }, 500);
      })
      .catch((err) => {
        console.log("err========> ", err);
        // setisLoading(false);
        SnackBarCommon({ text: err });
      })
      .finally(
        () => { }
        //setisLoading(false)
      );
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
      <TouchableOpacity onPress={onPressClick} activeOpacity={activeOpacity}>
        <TextInputView
          placeholder={placeHolder}
          onChangeText={onChangeText}
          secureTextEntry={false}
          value={value}
          text={lable}
          editable={keyboardType === "null" ? false : true}
          keyboardType={keyboardType === "null" ? "default" : keyboardType}
          height={lable === "About" ? 150 : null}
          multiline={multiline}
        />
      </TouchableOpacity>
    );
  };

  const onAddHashClick = () => {
    Keyboard.dismiss();
    var hashTagAdd = [];
    if (selectedHashValuesArr.length < 15) {
      if (hashTagText != "") {
        var obj = {
          hashtag_name: hashTagText,
          id: generateUUID(1),
        };
        hashTagAdd.push(obj);
      } else {
        showMessage({
          message: "Enter keyword",
          type: "danger",
        });
      }
    } else {
      showMessage({
        message: "Maximum fifteen keyword added.",
        type: "danger",
      });
    }
    if (hashTagAdd.length > 0) {
      const output = mergeArrays(selectedHashValuesArr, hashTagAdd);
      setSelectedHashValueArr(output);
      setHashTagText("");
    }
  };

  const onRemoveItemClick = (selectedValue) => {
    const output = selectedHashValuesArr.filter(
      (item) => item.hashtag_name !== selectedValue
    );
    setSelectedHashValueArr(output);
  };

  const mergeArrays = (arr1, arr2) => {
    const mergedArray = [
      ...arr2,
      ...arr1.filter(
        (item1) =>
          !arr2.some((item2) => item2.hashtag_name === item1.hashtag_name)
      ),
    ];

    return mergedArray;
  };

  const updateArray = (originalArray, updateArray) => {
    return originalArray.map((item) => {
      const updateItem = updateArray.find((update) => update.id === item.id);
      return updateItem ? updateItem : item;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <StatusBar
        backgroundColor={COLORS.white_txt}
        barStyle="dark-content"
      />
      <ToolbarBackButton
        btnText={"Edit Profile"}
        onBackPress={async () => {
          handleBackButtonClick();
        }}
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
              {/* <Image
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 90 / 2,
                }}
                source={
                  fileUri_profile != ''
                    ? { uri: fileUri_profile }
                    : profileImage != null && profileImage != undefined
                    ? {
                        uri: profileImage,
                      }
                    : require('../assets/user_pro.png')
                }
              /> */}

              <FastImage
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 90 / 2,
                }}
                source={
                  fileUri_profile != ""
                    ? { uri: fileUri_profile }
                    : profilePhoto != null &&
                      profilePhoto != undefined &&
                      profilePhoto != ""
                      ? {
                        uri: IMG_BASE_URL + profilePhoto,
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
            marginTop={3}
            textAlign={"center"}
          />

          {/* <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={() => {
              //getImgPermission();

              if (fImages.length > 0) {
                //  uploadProfileImages();
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
              renderItem={({ item, index }) => {
                return (
                  <>
                    {item.path != "" ? (
                      <TouchableOpacity
                        key={index.toString()} activeOpacity={activeOpacity}
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
                        {item.path != "" ? (
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
                          )
                        ) : null}
                      </TouchableOpacity>
                    ) : null}
                  </>
                );
                // if (index === 0) {
                //   return null;
                //   <TouchableOpacity
                //     activeOpacity={activeOpacity}
                //     onPress={() => {
                //       getImgPermission();

                //       if (imagesLive.length > 0) {
                //         if (fImages.length < 6) {
                //           setImageMaxLimitForNow(6 - (imagesLive.length + 1));
                //           getImgPermission();
                //         } else {
                //           SnackBarCommon({text: 'Image limit is only 5'});
                //         }
                //       } else {
                //         getImgPermission();
                //       }
                //     }}
                //     style={{
                //       justifyContent: "center",
                //       alignItems: "center",
                //       marginTop: 5,
                //       width: 80,
                //       height: 80,
                //       backgroundColor: COLORS.bg_color,
                //       borderRadius: 5,
                //       borderWidth: 0,
                //       marginHorizontal: 10
                //     }}
                //   >
                //     <Image
                //       source={require("../assets/ic_add_photo_alternate_24px.png")}
                //       resizeMode={"contain"}
                //       style={{
                //         width: 50,
                //         height: 50
                //       }}
                //     />
                //   </TouchableOpacity>
                // }
                // else {

                // }
              }}
              keyExtractor={(_, index) => index.toString()}
              ListEmptyComponent={() => {
                return (
                  <View style={{ width: wp(90) }}>
                    <TextCommonregular
                      text={"No images found"}
                      color={COLORS.black_txt}
                      fontSize={FONTS_SIZE.txt_14}
                      fontWeight={"500"}
                      textAlign={"center"}
                    />
                  </View>
                );
              }}
            />

            {/* <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => {
                //getImgPermission();

                if (fImages.length > 0) {
                  if (fImages.length < 6) {
                    setImageMaxLimitForNow(6 - (fImages.length + 1));
                    getImgPermission();
                  } else {
                    SnackBarCommon({ text: 'Image limit is only 5' });
                  }
                } else {
                  getImgPermission();
                }
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
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
                source={require('../assets/ic_add_photo_alternate_24px.png')}
                resizeMode={'contain'}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              backgroundColor: COLORS.white_txt,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 0,
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <TabView
              txt={"Personal"}
              visible={personalView}
              onPress={() => {
                setSocialView(false);
                setMediaView(false);
                setPersonalView(true);
                setKeywordView(false);
                setInstagramFollowersError(null);
                setYouTube_getSub_Error(null);
              }}
              borderBottomColor={
                personalView === true ? COLORS.primary : COLORS.white_txt
              }
              tintColor={
                personalView === true ? COLORS.primary : COLORS.gry_text
              }
              txtColor={
                personalView === true ? COLORS.primary : COLORS.gry_text
              }
            // tabBgColor={
            //   personalView === true
            //     ? COLORS.very_light_grey
            //     : COLORS.white_txt
            // }
            />
            <TabView
              txt={"Keyword"}
              visible={keywordView}
              onPress={() => {
                setSocialView(false);
                setMediaView(false);
                setPersonalView(false);
                setKeywordView(true);
                setInstagramFollowersError(null);
                setYouTube_getSub_Error(null);
              }}
              borderBottomColor={
                keywordView === true ? COLORS.primary : COLORS.white_txt
              }
              tintColor={
                keywordView === true ? COLORS.primary : COLORS.gry_text
              }
              txtColor={keywordView === true ? COLORS.primary : COLORS.gry_text}
            // tabBgColor={
            //   keywordView === true
            //     ? COLORS.very_light_grey
            //     : COLORS.white_txt
            // }
            />
            <TabView
              txt={"Social"}
              visible={socialView}
              onPress={() => {
                setSocialView(true);
                setMediaView(false);
                setPersonalView(false);
                setKeywordView(false);
                setInstagramFollowersError(null);
                setYouTube_getSub_Error(null);
              }}
              borderBottomColor={
                socialView === true ? COLORS.primary : COLORS.white_txt
              }
              tintColor={socialView === true ? COLORS.primary : COLORS.gry_text}
              txtColor={socialView === true ? COLORS.primary : COLORS.gry_text}
            // tabBgColor={
            //   socialView === true
            //     ? COLORS.very_light_grey
            //     : COLORS.white_txt
            // }
            />
            <TabView
              txt={"Media"}
              visible={mediaView}
              onPress={() => {
                setSocialView(false);
                setMediaView(true);
                setPersonalView(false);
                setKeywordView(false);
                setInstagramFollowersError(null);
                setYouTube_getSub_Error(null);
              }}
              borderBottomColor={
                mediaView === true ? COLORS.primary : COLORS.white_txt
              }
              tintColor={mediaView === true ? COLORS.primary : COLORS.gry_text}
              txtColor={mediaView === true ? COLORS.primary : COLORS.gry_text}
            // tabBgColor={
            //   socialView === true
            //     ? COLORS.very_light_grey
            //     : COLORS.white_txt
            // }
            />
          </View>

          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 5,
            }}
          >
            {personalView === true ? (
              <View>
                {accountView(
                  "Full Name",
                  "Enter full name",
                  (newText) => setFullName(newText),
                  full_name,
                  "default",
                  () => { },
                  false
                )}
                {/* {accountView(
                  "User Name",
                  "Enter user name",
                  (newText) => setUserName(newText),
                  user_name,
                  "default",
                  () => {}
                )} */}
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
                  "Category",
                  "",
                  (newText) => setCategory(newText),
                  category,
                  "null",
                  () => { },
                  true
                )}

                <View
                  style={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    marginTop: 5,
                    flex: 1,
                  }}
                >
                  {filterItemView("City", city != "" ? city : "City")}
                  {/* {filterItemView('Category', cat_name != '' ? cat_name : 'Category')}              
                  {filterItemView('State', state != "" ? state : 'State')} */}
                </View>

                <View
                  style={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    marginTop: 5,
                    flex: 1,
                  }}
                >
                  {filterItemView(
                    "Country",
                    country != "" ? country : "Country"
                  )}
                </View>

                {/* {accountView(
                  'Country',
                  'Enter country',
                  (newText) => setCountry(newText),
                  country,
                  'default',
                  () => { },
                  false
                )} */}

                {accountView(
                  "About",
                  "Enter about",
                  (newText) => setAbout(newText),
                  about,
                  "default",
                  () => { },
                  true
                )}
                {accountView(
                  "Company Name",
                  "Enter company name",
                  (newText) => setCompanyName(newText),
                  company_name,
                  "default",
                  () => { },
                  false
                )}
                {accountView(
                  "Website",
                  "Enter website ",
                  (newText) => setWebsiteUrl(newText),
                  website_url,
                  "default",
                  () => { },
                  false
                )}

                {/* <TextCommonregular
                  text={'Select Gender'}
                  color={COLORS.gry_text}
                  fontSize={FONTS_SIZE.txt_16}
                  fontWeight={'400'}
                  marginTop={10}
                /> */}
                <View
                  style={{
                    // width: "100%",
                    height: 45,
                    borderWidth: 1,
                    borderRadius: 5,
                    flexDirection: "row",
  
                    justifyContent: "center",
                    alignItems: "center",
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
            ) : null}

            {/* onPress={() => } */}

            {socialView === true ? (
              <View>
                {accountView(
                  "Instagram Id",
                  "Enter instagram id",
                  (newText) => setInstagramId(newText),
                  instagram_id,
                  "default",
                  () => { },
                  false
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "flex-end",
                    alignItems: "center",
  
                    marginTop: 5,
                  }}
                >
                  <TextCommonMedium
                    marginRight={15}
                    text={"Followers: " + kFormatter(instagram_followers)}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      getInstagramFollowers();
                    }}
                  >
                    <TextCommonMedium
                      text={"Update Followers"}
                      color={COLORS.primary}
                      fontSize={FONTS_SIZE.txt_15}
                      fontWeight={"600"}
                      textDecorationLine={"underline"}
                    />
                  </TouchableOpacity>
                </View>
                {instagram_followers_Error != null ? (
                  <TextCommonMedium
                    fontSize={FONTS_SIZE.txt_13}
                    color={COLORS.color_red}
                    text={instagram_followers_Error}
                    textAlign={"center"}
                    width={wp(90)}
                    marginTop={10}
                  />
                ) : null}

                {accountView(
                  "YouTube Channel ",
                  "Enter youtube channel ",
                  (newText) => setYouTubeId(newText),
                  youtube_id,
                  "default",
                  () => { },
                  false
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "flex-end",
                    alignItems: "center",
  
                    marginTop: 5,
                  }}
                >
                  <TextCommonMedium
                    marginRight={15}
                    text={"Subscribers: " + kFormatter(youTube_Suscriber_Count)}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      getYoutubeSub();
                    }}
                  >
                    <TextCommonMedium
                      text={"Update Subscribers"}
                      color={COLORS.primary}
                      fontSize={FONTS_SIZE.txt_15}
                      fontWeight={"600"}
                      textDecorationLine={"underline"}
                    />
                  </TouchableOpacity>
                </View>
                {youTube_getSub_Error != null ? (
                  <TextCommonMedium
                    fontSize={FONTS_SIZE.txt_13}
                    color={COLORS.color_red}
                    text={youTube_getSub_Error}
                    textAlign={"center"}
                    width={wp(90)}
                    marginTop={10}
                  />
                ) : null}

                {/* {accountView(
                  "Facebook Username",
                  "Enter facebook username",
                  (newText) => setFacebookId(newText),
                  facebook_id,
                  "default",
                  () => {}
                )}

                {accountView(
                  "LinkedIn Username (Optional)",
                  "Enter linkedIn username",
                  (newText) => setLinkedInName(newText),
                  linkedInName,
                  "default",
                  () => {}
                )}

                {accountView(
                  "Twitter Username (Optional)",
                  "Enter twitter username",
                  (newText) => settwitterId(newText),
                  twitterID,
                  "default",
                  () => {}
                )}

                {accountView(
                  "Pinterest Username (Optional)",
                  "Enter pinterest username",
                  (newText) => setPinterestName(newText),
                  pinterestName,
                  "default",
                  () => {}
                )} */}
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
            ) : null}

            {keywordView === true ? (
              <View
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingBottom: 0,
                  marginTop: 5,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextInputView
                    placeholder={"Enter keyword"}
                    onChangeText={(val) => setHashTagText(val)}
                    value={hashTagText}
                    editable={true}
                    keyboardType={"default"}
                    numberOfLines={1}
                    multiline={false}
                  />

                  <LinearGradient
                    colors={["#ef4b53", "#eb297b"]}
                    style={{ borderRadius: 8, marginTop: 10 }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 75,
                        height: Platform.OS === "ios" ? 42 : 55,
                        justifyContent: "center",
                        alignItems: "center",
                        // backgroundColor: COLORS.primary,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        // marginTop: 10,
                      }}
                      onPress={() => onAddHashClick()}
                    >
                      <TextCommonMedium
                        text={"Add"}
                        color={COLORS.white_txt}
                        fontSize={FONTS_SIZE.txt_14}
                        fontWeight={"500"}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>

                <View>
                  <View
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      flexDirection: "row",
                      marginTop: 10,
                    }}
                  >
                    {selectedHashValuesArr.length > 0
                      ? selectedHashValuesArr.map((item, index) => {
                        return (
                          <View
                            // onPress={() => setHashTagText(item.hashtag_name)}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 10,
                              paddingHorizontal: 10,
                              marginHorizontal: index >= 1 ? 10 : 0,
                              paddingVertical: 5,
                              backgroundColor: COLORS.very_light_grey,
                              borderRadius: 30,
                              borderWidth: 0.4,
                              borderColor: COLORS.gry_text,
                            }}
                          >
                            <TextCommonregular
                              text={item.hashtag_name}
                              color={COLORS.black_txt}
                              fontSize={FONTS_SIZE.txt_11}
                              fontWeight={"400"}
                            />

                            <TouchableOpacity
                              style={{
                                padding: 7,
                                backgroundColor: COLORS.refecode_backcolor,
                                borderRadius: 50 / 2,
                                marginLeft: 8,
                              }}
                              onPress={() =>
                                onRemoveItemClick(item.hashtag_name)
                              }
                            >
                              <Image
                                style={{
                                  width: 8,
                                  height: 8,
                                  tintColor: COLORS.color_red,
                                }}
                                source={require("../assets/close_icon.png")}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })
                      : null}
                  </View>
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
            ) : null}

            {mediaView === true ? (
              <View
                style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                {fImages.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index.toString()} activeOpacity={activeOpacity}
                      onPress={() => {
                        if (imgCount >= 5) {
                          showMessage({
                            message: "Maximum five media files can be uploaded",
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
                        width: boxWidth - 30,
                        height: 200,
                        borderRadius: 8,
                        borderWidth: 0.5,
                        marginHorizontal: 5,
                        marginTop: 12,
                        backgroundColor: COLORS.very_light_grey,
                        borderColor: COLORS.border_color,
                      }}
                    >
                      {item.isOnline === true ? (
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
                              width: boxWidth - 30,
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
                              width: boxWidth - 30,
                              height: 200,
                              borderRadius: 8,
                            }}
                          />
                        )
                      ) : item.type === "video" ? (
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
                            width: boxWidth - 30,
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
                            width: boxWidth - 30,
                            height: 200,
                            borderRadius: 8,
                          }}
                        />
                      )}

                      <TouchableOpacity
                        key={index.toString()} activeOpacity={activeOpacity}
                        style={{
                          position: "absolute",
                          right: -5,
                          top: 180,
                          width: 28,
                          height: 28,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            item.path != ""
                              ? COLORS.very_light_orange
                              : COLORS.yellow_light,
                          borderRadius: 30,
                          borderColor:
                            item.path != ""
                              ? COLORS.gry_light
                              : COLORS.yellow_light,
                          borderWidth: 0.6,
                        }}
                        onPress={() => {
                          if (
                            item.path != "" &&
                            item.isOnline != undefined &&
                            item.isOnline != ""
                          ) {
                            setDeleteIndex(index);
                            setShowAlertDelete(true);
                          } else {
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
                            item.path != ""
                              ? require("../assets/close_icon.png")
                              : require("../assets/add_icon.png")
                          }
                          resizeMode={"contain"}
                          style={{
                            width: 10,
                            height: 10,
                            tintColor:
                              item.path != ""
                                ? COLORS.color_red
                                : COLORS.white_original,
                          }}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
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

export default EditProfilePage;
