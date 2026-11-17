import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import {
  COLORS,
  FONTS,
  FONTS_SIZE,
  analyticsLog,
  elevation,
  kFormatter,
} from "../common/utils";
import InternetPermission from "../common/InternetPermission";
import ItemInfluencerList from "../ItemView/ItemInfluencerList";
import Header from "../common/Header";
import axios from "axios";
import Loader from "../common/LoadingScreen";
import APIWebCall from "../common/APIWebCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnackBarCommon from "../common/SnackBarCommon";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ItemCategoryListSearchScreen from "../ItemView/ItemCategoryListSearchScreen";
import ToolbarBackButtonNew from "../common/ToolbarBackButtonNew";
import EmptyView from "../common/EmptyView";
import { useIsFocused } from "@react-navigation/native";

function InfluencerListPage({ navigation, route }) {
  // const navigation = useNavigation();

  const { type_name, category_id } = route.params;

  const [isLoading, setisLoading] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState("");
  const [influencerArr, setInfluencerArr] = useState([]);
  const [searchInfluencer, setSearchInfluencer] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const [cat_id, setCat_id] = useState("");
  const [catName, setCatName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const isFocused = useIsFocused();

  var static_Arr = [
    {
      category_name: "All",
      isSelected: false,
      id: 0,
    },
  ];

  useEffect(() => {
    getData("", "");
  }, [isFocused, category_id]);

  useFocusEffect(
    useCallback(() => {
      analyticsLog("InfluencerList_screen");
      setSearchVisible(false);
      setSelectedIndex(null);
      setInfluencerArr([]);
      setSearchInfluencer("");
      setCat_id("");
      setCatName("");
      if (category_id == null || category_id === undefined) {
        setSelectedIndex(0);
      } else {
        setCat_id(category_id);
      }
      influencerCategoryListAPICall();
      // getData('', '');
    }, [])
  );

  // const openControlPanel = () => {
  //   navigation.dispatch(DrawerActions.openDrawer());
  // };

  const getData = async (searchValue, cat_id) => {
    if (category_id != null) {
      influencerListByCategoryAPI(searchValue);
    } else {
      influencerListAPI(searchValue, cat_id);
    }
    // setTimeout(() => {
    //   if (influencerArr != undefined || influencerArr != null) {
    //     influencerArr.forEach((element, index) => {
    //       getInstagramFollowers(element, index);
    //     });
    //   }
    // }, 200);
  };

  const influencerListByCategoryAPI = async (searchValue) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    if (isInternetGranted == true) {
      var data = new FormData();
      if (searchValue === "") {
        setisLoading(true);
      }
      // data.append('category_id', cat_id);
      data.append("category_id", category_id);
      data.append("search", searchValue);
      onInfluencerListByCategoryAPICall(data);
    }
  };

  const onInfluencerListByCategoryAPICall = async (data) => {
    APIWebCall.onInfluencerListByCategoryAPICall(data)
      .then(async (response) => {
        setisLoading(false);

        if (
          response.data.CategoryInfluencerList.length > 0 &&
          response.data.CategoryInfluencerList != undefined &&
          response.data.CategoryInfluencerList != null
        ) {
          setInfluencerArr(response.data.CategoryInfluencerList);
        } else {
          setInfluencerArr([]);
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

  const influencerListAPI = async (searchValue, catId) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    if (isInternetGranted == true) {
      if (searchValue === "") {
        setisLoading(true);
      }
      var data = new FormData();
      data.append("type", type_name);
      data.append("search", searchValue);
      data.append("category_id", catId);
      onInfluencerListAPICall(data);
      console.log("influencerListAP data--------------------", data);
    }
  };

  const onInfluencerListAPICall = async (data) => {
    APIWebCall.onInfluencerListByTypeAPICall(data)
      .then(async (response) => {
        setisLoading(false);

        if (
          response.data.TypeInfluencerList.length > 0 &&
          response.data.TypeInfluencerList != undefined &&
          response.data.TypeInfluencerList != null
        ) {
          setInfluencerArr(response.data.TypeInfluencerList);
        } else {
          setInfluencerArr([]);
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

  const onInfluencerProfileClick = async (item) => {
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
  };

  const influencerCategoryListAPICall = async () => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    if (isInternetGranted == true) {
      onInfluencerCategoryListAPICall();
    }
  };

  const onInfluencerCategoryListAPICall = async () => {
    setisLoading(true);
    APIWebCall.onInfluencerCategoryListAPICall()
      .then(async (response) => {
        setisLoading(false);

        // if (
        //   response.data.category != undefined &&
        //   response.data.category != null
        // ) {
        //   setCategoryList(response.data.category);
        // }

        var category_Ayy = [];
        const categories =
          response?.data?.category ||
          response?.category ||
          (Array.isArray(response?.data) ? response?.data : null) ||
          [];
        if (Array.isArray(categories) && categories.length > 0) {
          categories.forEach((element) => {
            const catName = element?.name || element?.category_name || "";
            var obj = {
              name: catName,
              category_name: catName,
              isSelected: false,
              id: element.id,
              ...element,
            };
            category_Ayy.push(obj);
          });
        }
        setCategoryList([...static_Arr, ...category_Ayy]);
      })
      .catch((err) => {
        setisLoading(false);
        setTimeout(() => {
          SnackBarCommon({ text: err.message });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const onCatItemClick = async (item, index) => {
    if (item.id === 0) {
      setSelectedIndex(null);
      setSearchInfluencer("");
      setCat_id("");
      setCatName("");
      setTimeout(() => {
        getData("", "");
      }, 200);
    } else {
      setSelectedIndex(item.id);
      setCat_id(item.id);
      setCatName(item.category_name);
      influencerListAPI(searchInfluencer, item.id);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_txt,
        justifyContent: "center",
        // alignItems: 'center',
        //  paddingTop: 10
      }}
    >
      {type_name == "Trending" ? (
        <ToolbarBackButtonNew
          btnText={"Recently Added"}
          onBackPress={() => navigation.goBack()}
          rightIcon={require("../assets/search_icon.png")}
          onRightClick={() => setSearchVisible(!searchVisible)}
          // onFilterClick={() => {
          //   setSelectedIndex(null);
          //   setSearchInfluencer('');
          //   setCat_id('');
          //   setCatName('');
          //   setTimeout(() => {
          //     getData('', '');
          //   }, 200);
          // }}
          // filterIcon={require('../assets/filter.png')}
        />
      ) : (
        <ToolbarBackButtonNew
          btnText={type_name}
          onBackPress={() => navigation.goBack()}
          rightIcon={require("../assets/search_icon.png")}
          onRightClick={() => setSearchVisible(!searchVisible)}
          // onFilterClick={() => {
          //   setSelectedIndex(null);
          //   setSearchInfluencer('');
          //   setCat_id('');
          //   setCatName('');
          //   setTimeout(() => {
          //     getData('', '');
          //   }, 200);
          // }}
          // filterIcon={require('../assets/filter.png')}
        />
      )}

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
              placeholder="Search for influencer"
              placeholderTextColor={COLORS.gry_light}
              onChangeText={(newText) => {
                setSearchInfluencer(newText);
                if (newText != "") {
                  getData(newText, cat_id);
                } else {
                  getData("", cat_id);
                }
              }}
              value={searchInfluencer}
              returnKeyType={"default"}
              onSubmitEditing={() => {
                getData(searchInfluencer);
              }}
            />
          </View>
        </View>
      ) : null}
      {category_id === null ? (
        <View>
          <FlatList
            data={categoryList}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              padding: 5,
              paddingBottom: 15,
              marginTop: 5,
              marginLeft: 3,
            }}
            extraData={selectedIndex}
            renderItem={({ item, index }) => {
              return (
                <ItemCategoryListSearchScreen
                  selectedIndex={selectedIndex}
                  index={index}
                  item={item}
                  onItemClick={() => {
                    onCatItemClick(item, index);
                    //onInfluencerProfileClick(item);
                    // navigation.navigate('InfluencerListPage', {
                    //   type_name: item.category_name,
                    //   category_id: item.id,
                    // });
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

      <FlatList
        data={influencerArr}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 5,
          paddingBottom: 15,
          alignItems: "center",
        }}
        renderItem={({ item, index }) => {
          return (
            <ItemInfluencerList
              item={item}
              onItemClick={() => {
                onInfluencerProfileClick(item);
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
        // refreshing={isRefresh}
      />

      <Loader loading={isLoading} />
    </View>
  );
}

export default InfluencerListPage;
