import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity
} from "react-native";
import { COLORS, FONTS, FONTS_SIZE, elevation } from "../common/utils";
import TextCommonSemiBlod from "../common/TextCommonSemiBlod";
import TextInputView from "../common/TextInputView";
import ItemInfluencerList from "../ItemView/ItemInfluencerList";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import SnackBarCommon from "../common/SnackBarCommon";
import Loader from "../common/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyView from "../common/EmptyView";
import ToolbarBackButton from "../common/ToolbarBackButton";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/routers";
import Header from "../common/Header";
import ItemInfluencerCategory from "../ItemView/ItemInfluencerCategory";
import ItemCategoryListSearchScreen from "../ItemView/ItemCategoryListSearchScreen";
import ItemHashTagList from "../ItemView/ItemHashTagList";
var _ = require("lodash");

const SearchHashTagListPage = ({ navigation }) => {
  const [searchInfluencer, setSearchInfluencer] = useState("");
  const [hashTagArr, setHashTagArr] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryItem, setSelectedCategoryItem] = useState(false);
  const [cat_id, setCat_id] = useState("");
  const [catName, setCatName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  var static_arr = [{ category_name: "All", isSelected: false, id: 0 }];

  useFocusEffect(
    useCallback(() => {
      getData("", "");
      setHashTagArr([]);
      setSelectedIndex(null);
      setSearchInfluencer("");
      setCat_id("");
      influencerCategoryListAPICall();
    }, [])
  );

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

  const getData = async (searchInfluencer, cat_Id) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();

    if (isInternetGranted == true) {
      var data = new FormData();
      data.append("filter", searchInfluencer);
      data.append("category_id", cat_Id);

      console.log(data);
      onGeHashListAPICall(data);
    }
  };

  const onGeHashListAPICall = async (data) => {
    APIWebCall.onGeHashListAPICall(data)
      .then(async (response) => {
        setisLoading(false);

        if (
          response.data.Hashtag.length > 0 &&
          response.data.Hashtag != undefined &&
          response.data.Hashtag != null
        ) {
          setHashTagArr(response.data.Hashtag);
        } else {
          setHashTagArr([]);
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
    navigation.navigate("SearchInfluencerPage", {
      // cat_id: item.category_id,
      cat_id: cat_id,
      // has_id: item.id,
      has_id: item.hashtag
    });

    // var user_id = await AsyncStorage.getItem('user_id');
    // console.log('--------------', user_id + '  ' + item.id);
    // if (user_id === item.id) {
    //   navigation.navigate('InfluencerProfilePage', {
    //     item: user_id,
    //     type: '1',
    //   });
    // } else {
    //   navigation.navigate('InfluencerProfilePage', {
    //     item: item.id,
    //     type: '1',
    //   });
    // }
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
        setCategoryList([...static_arr, ...category_Ayy]);
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
      setHashTagArr([]);
      setSearchInfluencer("");
      setCat_id("");
      setSelectedIndex(null);
      getData("", "");
    } else {
      setSelectedIndex(item.id);
      setCat_id(item.id);
      setCatName(item.category_name);
      // setSearchInfluencer(item.category_name);
      getData(item.category_name, item.id);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <Header
        btnText={"Search"}
        backIcon={require("../assets/menu_icon.png")}
        onBackClick={() => openControlPanel()}
        rightIconVisible={true}
      // filter={require("../assets/filter.png")}
      // onFilterClick={() => {

      // }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 50,
          backgroundColor: COLORS.white_original,
          marginTop: 8,
          borderRadius: 5,
          padding: 5,
          elevation: elevation,
          marginLeft: 10,
          marginRight: 10
        }}
      >
        <View style={{ marginLeft: 10 }}>
          <Image
            style={{ height: 18, width: 18, tintColor: COLORS.gry_text }}
            resizeMode="contain"
            source={require("../assets/search_icon.png")}
          />
        </View>
        <View style={{ marginLeft: 3, height: 55, width: "85%" }}>
          <TextInput
            style={{
              color: COLORS.black_txt,
              fontSize: FONTS_SIZE.txt_14,
              fontFamily: FONTS.FontRegular,
              textAlign: "left",
              flex: 1,
              marginLeft: 10
            }}
            placeholder="Search for hashtag"
            placeholderTextColor={COLORS.gry_light}
            onChangeText={(newText) => {
              setSearchInfluencer(newText);
              setSelectedIndex(null);
              if (newText != "") {
                getData(newText, cat_id);
              } else {
                setHashTagArr([]);
                getData("", cat_id);
              }


            }}
            value={searchInfluencer}
            returnKeyType={"default"}
            onSubmitEditing={() => {
              setHashTagArr([]);
              getData(searchInfluencer, cat_id);
            }}
          />
        </View>
      </View>

      <View>
        {/* <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate('InfluencerListPage', {
          //     type_name: 'Categories Influencers',
          //   });
          // }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 2,
          }}
        >
          <TextCommonSemiBlod
            text={'Categories'}
            fontSize={FONTS_SIZE.txt_15}
            fontWeight={'500'}
            color={COLORS.comment_bg_color}
            numberOfLines={1}
            includeFontPadding={false}
            marginLeft={10}
          />
          <TextCommonSemiBlod
            text={'View All'}
            fontSize={FONTS_SIZE.txt_13}
            fontWeight={'500'}
            color={COLORS.primary}
            numberOfLines={1}
            includeFontPadding={false}
            marginRight={10}
          />
        </TouchableOpacity> */}
        <FlatList
          data={categoryList}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            padding: 5,
            paddingBottom: 15,
            marginTop: 5,
            marginLeft: 3
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

      <View style={{}}>
        <FlatList
          data={hashTagArr}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 11,
            paddingRight: 10,
            paddingBottom: hp(30)
          }}
          renderItem={({ item, index }) => {
            return (
              <ItemHashTagList
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
        {/* <Loader loading={isLoading} /> */}
      </View>
    </View>
  );
};

export default SearchHashTagListPage;
