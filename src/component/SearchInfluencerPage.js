
import React, { useEffect, useState, useCallback } from "react";
import {
  View, Image, TextInput, FlatList, TouchableOpacity, Text,
  BackHandler, RefreshControl,
} from "react-native";
import { COLORS, FONTS, FONTS_SIZE, analyticsLog, elevation } from "../common/utils";
import ItemInfluencerList from "../ItemView/ItemInfluencerList";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import SnackBarCommon from "../common/SnackBarCommon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyView from "../common/EmptyView";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/routers";
import Header from "../common/Header";
import ItemCategoryListSearchScreen from "../ItemView/ItemCategoryListSearchScreen";

const removeStorageKeys = async (keys) => {
  try {
    if (typeof AsyncStorage.removeMany === 'function') {
      await AsyncStorage.removeMany(keys);
    } else if (typeof AsyncStorage.multiRemove === 'function') {
      await AsyncStorage.multiRemove(keys);
    } else {
      await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
    }
  } catch (error) {
    console.log('Storage remove error:', error);
  }
};

const SearchInfluencerPage = ({ navigation, route }) => {
  const [searchInfluencer, setSearchInfluencer] = useState("");
  const [searchInfluencerArr, setSearchInfluencerArr] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [catName, setCatName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [cat_id_new, setCat_id] = useState("");
  const [cat_id_second, setCat_id_second] = useState("");
  const [hashTagRemove, setHashTagRemove] = useState(false);
  const [categoryRemove, setCategoryRemove] = useState(false);
  const [city, setCity] = useState("");
  const [city_id, setCity_id] = useState("");
  const [hashtag_Pass_API, setHastag_PASS_API] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    influencerCategoryListAPICall();
    setSearchInfluencerArr([]);
    setCity("");
    setCity_id("");
  }, []);

  useEffect(() => {
    on_getCity_db();
    setSearchInfluencerArr([]);
  }, [isFocused]);

  const static_arr = [{ category_name: "All", isSelected: false, id: 0 }];

  const handleBack = useCallback(() => {
    setCity_id("");
    setCity("");
    setSearchInfluencerArr([]);
    setSearchInfluencer("");
    setHashTagRemove(false);
    setCategoryRemove(false);
    removeStorageKeys([
      "city_id_edit",
      "city_edit",
      "selectFilterCity_edit",
    ]);
    navigation.goBack();
    return true;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setSearchInfluencerArr([]);
      analyticsLog("SearchInfluencer_screen");
      setCat_id_second("");
      getData(searchInfluencer, cat_id_new ?? "", true);

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBack,
      );

      return () => subscription.remove();
    }, [city_id, searchInfluencer, cat_id_new, handleBack]),
  );

  const on_getCity_db = async () => {
    try {
      const city_id_bd = await AsyncStorage.getItem("city_id_edit");
      const city_bd = await AsyncStorage.getItem("city_edit");
      if (city_id_bd != null) setCity_id(city_id_bd);
      if (city_bd != null) setCity(city_bd);
    } catch (error) {
      console.log("Get city error:", error);
    }
  };

  const getData = async (searchText, cate_id_pass, htr) => {
    try {
      const isInternetGranted = await InternetPermission.checkInternetPermissions();
      if (!isInternetGranted) return;

      const data = new FormData();
      data.append("filter", searchText || "");

      if (htr === true) {
        data.append("hashTag_name", "");
      } else {
        data.append("hashTag_name", hashTagRemove ? "" : hashtag_Pass_API);
      }

      if (cate_id_pass !== undefined && cate_id_pass !== null && cate_id_pass !== "") {
        data.append("category_id[]", categoryRemove ? "" : String(cate_id_pass));
      }

      if (city_id !== undefined && city_id !== null && city_id !== "") {
        data.append("city_id", city_id);
      }

      onSearchInfluencerListAPICall(data);
    } catch (error) {
      console.log("Get influencer data error:", error);
    }
  };

  const onSearchInfluencerListAPICall = async data => {
    setisLoading(true);
    try {
      const response = await APIWebCall.onSearchInfluencerListAPICall(data);
      const users = response?.data?.user;
      setSearchInfluencerArr(Array.isArray(users) ? users : []);
    } catch (error) {
      setSearchInfluencerArr([]);
      setTimeout(() => {
        SnackBarCommon({ text: error?.message || "Something went wrong" });
      }, 120);
    } finally {
      setisLoading(false);
    }
  };

  const onInfluencerProfileClick = async item => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      await removeStorageKeys(["city_edit", "selectFilterCity_edit"]);
      navigation.navigate("InfluencerProfilePage", {
        item: user_id === item.id ? user_id : item.id,
        type: "1",
      });
    } catch (error) {
      console.log("Open influencer profile error:", error);
    }
  };

  const influencerCategoryListAPICall = async () => {
    try {
      const isInternetGranted = await InternetPermission.checkInternetPermissions();
      if (isInternetGranted) await onInfluencerCategoryListAPICall();
    } catch (error) {
      console.log("Category permission error:", error);
    }
  };

  const onInfluencerCategoryListAPICall = async () => {
    setisLoading(true);
    try {
      const response = await APIWebCall.onInfluencerCategoryListAPICall();
      const categories =
        response?.data?.category ||
        response?.category ||
        (Array.isArray(response?.data) ? response?.data : null) ||
        [];
      if (Array.isArray(categories) && categories.length > 0) {
        const category_Ayy = categories.map(element => {
          const selected = cat_id_second === "" && String(cat_id_new) === String(element.id);
          if (selected) setSelectedIndex(element.id);
          const catName = element?.name || element?.category_name || "";
          return {
            name: catName,
            category_name: catName,
            isSelected: selected,
            id: element.id,
            ...element,
          };
        });
        setCategoryList([...static_arr, ...category_Ayy]);
      } else {
        setCategoryList(static_arr);
      }
    } catch (error) {
      console.log("Category API error:", error);
      setCategoryList(static_arr);
      setTimeout(() => {
        SnackBarCommon({ text: error?.message || "Unable to load categories" });
      }, 120);
    } finally {
      setisLoading(false);
    }
  };

  const onCatItemClick = (item, index) => {
    setSelectedIndex(item.id === 0 ? null : item.id);
    setCat_id(item.id === 0 ? "" : String(item.id));
    setCatName(item.id === 0 ? "" : item.category_name);
    setSearchInfluencerArr([]);
    getData(searchInfluencer, item.id === 0 ? "" : item.id, true);
  };

  const onCityClear = async () => {
    setCity_id("");
    setCity("");
    setHashTagRemove(true);
    setCategoryRemove(false);
    await removeStorageKeys([
      "city_id_edit",
      "city_edit",
      "selectFilterCity_edit",
    ]);
    getData(searchInfluencer, cat_id_new, true);
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchInfluencer("");
    setSearchInfluencerArr([]);
    setCat_id("");
    setCity_id("");
    setSelectedIndex(null);
    await removeStorageKeys([
      "city_id_edit",
      "city_edit",
      "selectFilterCity_edit",
    ]);
    getData("", "", true).finally(() => setRefreshing(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <Header
        btnText="Search Influencer"
        backIcon={require("../assets/menu_icon.png")}
        onBackClick={openControlPanel}
        rightIconVisible={city !== ""}
        filter={require("../assets/clear-filter.png")}
        onFilterClick={() => {
          if (city !== "") onCityClear();
        }}
      />

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 5 }}>
        <View style={{
          flexDirection: "row", alignItems: "center", height: 50, width: "50%",
          backgroundColor: COLORS.white_original, marginTop: 8, borderRadius: 5,
          elevation, marginLeft: 10,
        }}>
          <View style={{ marginLeft: 10 }}>
            <Image
              style={{ height: 17, width: 17, tintColor: COLORS.gry_text }}
              resizeMode="contain"
              source={require("../assets/search_icon.png")}
            />
          </View>
          <View style={{ height: 55, width: "85%" }}>
            <TextInput
              style={{
                color: COLORS.black_txt, fontSize: FONTS_SIZE.txt_14,
                fontFamily: FONTS.FontRegular, textAlign: "left", flex: 1,
                marginLeft: 10, marginTop: 5,
              }}
              placeholder="Search Influencer"
              placeholderTextColor={COLORS.black_txt}
              value={searchInfluencer}
              onChangeText={newText => {
                setSearchInfluencer(newText);
                setSearchInfluencerArr([]);
                getData(newText, cat_id_new, true);
              }}
              returnKeyType="search"
              onSubmitEditing={() => getData(searchInfluencer, cat_id_new, false)}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("SelectCityPage", { title: "City" })}
          activeOpacity={0.9}
          style={{ width: "50%" }}>
          <View style={{
            flexDirection: "row", alignItems: "center", height: 50,
            backgroundColor: COLORS.white_original, marginTop: 8, borderRadius: 5,
            padding: 5, elevation, marginLeft: 10, marginRight: 10,
          }}>
            <View style={{ marginLeft: 2 }}>
              <Image
                style={{ height: 18, width: 18, tintColor: COLORS.gry_text }}
                resizeMode="contain"
                source={require("../assets/pin.png")}
              />
            </View>
            <Text style={{
              color: COLORS.black_txt, fontSize: FONTS_SIZE.txt_14,
              fontFamily: FONTS.FontRegular, padding: 5,
            }}>
              {city !== "" ? city : "Location"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          data={categoryList}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ padding: 5, marginTop: 5, marginLeft: 3 }}
          extraData={selectedIndex}
          renderItem={({ item, index }) => (
            <ItemCategoryListSearchScreen
              selectedIndex={selectedIndex}
              index={index}
              item={item}
              onItemClick={() => onCatItemClick(item, index)}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>

      <View style={{ marginTop: 8, flex: 1 }}>
        <FlatList
          data={searchInfluencerArr}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 11, paddingRight: 10, paddingBottom: hp(30),
          }}
          renderItem={({ item }) => (
            <ItemInfluencerList
              item={item}
              onItemClick={() => onInfluencerProfileClick(item)}
            />
          )}
          ListEmptyComponent={() =>
            !isLoading ? <EmptyView msgText="No data found" /> : null
          }
          keyExtractor={(item, index) => String(item?.id ?? index)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

export default SearchInfluencerPage;
