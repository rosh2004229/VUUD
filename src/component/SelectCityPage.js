import React, { useCallback, useContext, useState } from "react";
import {
  TouchableOpacity,
  FlatList,
  View,
  Image,
  TextInput,
} from "react-native";
import {
  COLORS,
  FONTS,
  FONTS_SIZE,
  activeOpacity,
  elevation,
} from "../common/utils";
import ToolbarBackButton from "../common/ToolbarBackButton";
import TextCommonMedium from "../common/TextCommonMedium";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../common/LoadingScreen";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import SnackBarCommon from "../common/SnackBarCommon";
import EmptyView from "../common/EmptyView";
var _ = require("lodash");

function SelectCityPage({ route, navigation }) {
  const { title } = route.params;

  const [dataList, setDataList] = useState([]);
  const [searchCity, setSearchCity] = useState("");

  // const [selectFilterCategory, setSelectedFilterCategory] = useState([]);
  const [selectFilterCity, setSelectedFilterCity] = useState([]);

  // const [stateId, setStateId] = useState('');

  const [cityId, setCityId] = useState("");
  const [city, setCity] = useState("");

  //   const [cat, setCat] = useState('');
  //   const [cat_id, setCat_id] = useState('');
  const [isLoading, setisLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setCity("");
      setCityId("");
      getSelectedCategory("");
      setSearchCity("");
      setDataList([]);
      setSelectedFilterCity([]);
    }, [title])
  );

  const getSelectedCategory = async (searchValue) => {
    switch (title) {
      case "City":
        var isInternetGranted =
          await InternetPermission.checkInternetPermissions();
        if (isInternetGranted == true) {
          // onGetCityListAPICall();
          if (searchValue === "") {
            setisLoading(true);
          }
          var data = new FormData();
          data.append("filter", searchValue);
          onGetCityListAPICall(data);
        }
        break;
      default:
        break;
    }
  };

  // const cityListAPI = async (searchValue) => {
  //     var isInternetGranted = await InternetPermission.checkInternetPermissions();

  //     if (isInternetGranted == true) {
  //         if (searchValue === '') {
  //             setisLoading(true);
  //         }
  //         var data = new FormData();
  //         data.append('filter', searchValue);
  //         console.log("data------------11111111111", data);
  //         onGetCityListAPICall(data);
  //     }
  // };

  const onGetCityListAPICall = async (data) => {
    const selectFilterCity_db = await AsyncStorage.getItem(
      "selectFilterCity_edit"
    );
    console.log({ selectFilterCity_db });
    // setisLoading(true);
    APIWebCall.onGetCityListAPICall(data)
      .then(async (response) => {
        // console.log("response------------------->", response.data.city)
        setisLoading(false);
        var city_Ayy = [];
        if (response.data.city != undefined && response.data.city != null) {
          if (response.data.city.length > 0) {
            response.data.city.forEach((element) => {
              // console.log("elementcity1111111-------------------", element)
              var obj = {
                name: element.city,
                isSelected: false,
                id: element.id,
              };
              city_Ayy.push(obj);
            });
          } else {
            setDataList([]);
          }
          if (selectFilterCity_db != null) {
            var selectFilterCity_db_parse = JSON.parse(selectFilterCity_db);
            const updatedArrayCity = city_Ayy.map((item) => {
              const selectedItem = selectFilterCity_db_parse
                .flat()
                .find((selected) => selected.id === item.id);
              if (selectedItem) {
                return { ...item, isSelected: selectedItem.isSelected };
              }
              return item;
            });
            setDataList(updatedArrayCity);
          } else {
            setDataList(city_Ayy);
          }
        }
      })
      .catch((err) => {
        setisLoading(false);
        setDataList([]);
        // setTimeout(() => {
        //     SnackBarCommon({ text: err.message });
        // }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const onItemCLick = (item, index) => {
    switch (title) {
      case "City":
        var temp = [...dataList];
        temp.forEach((element, idx) => {
          if (idx === index) {
            element.isSelected = true;
          } else {
            element.isSelected = false;
          }
        });
        const selected_City_Filter = _.filter(
          temp,
          (item) => item.isSelected === true
        );

        setDataList(temp);
        setCityId(item.id);
        setCity(item.name);
        setSelectedFilterCity(selected_City_Filter);
        break;

      default:
        break;
    }
  };

  const onRightClick = () => {
    switch (title) {
      case "City":
        if (selectFilterCity.length > 0) {
          AsyncStorage.setItem(
            "selectFilterCity_edit",
            JSON.stringify(selectFilterCity)
          );
          AsyncStorage.setItem("city_id_edit", cityId.toString());
          AsyncStorage.setItem("city_edit", city);
        }
        navigation.goBack(null);
        break;

      default:
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <ToolbarBackButton
        btnText={title}
        // onBackPress={() => navigation.navigate("EditProfilePage")}
        onBackPress={() => navigation.goBack(null)}
        rightIcon={require("../assets/right_icon.png")}
        onRightClick={() => onRightClick()}
      />
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
          marginBottom: 10,
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
            placeholder="Search for city"
            placeholderTextColor={COLORS.gry_light}
            onChangeText={(newText) => {
              setSearchCity(newText);
              if (newText != "") {
                getSelectedCategory(newText);
              } else {
                getSelectedCategory("");
              }
            }}
            value={searchCity}
            returnKeyType={"default"}
            onSubmitEditing={() => {
              getSelectedCategory(searchCity);
            }}
          />
        </View>
      </View>

      <FlatList
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={"always"}
        data={dataList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          alignItems: "center",
        }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              style={{
                backgroundColor: COLORS.white_txt,
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 10,
                width: "93%",
                marginVertical: 5,
                shadowColor: COLORS.shadow_color,
                shadowOffset: { width: -2, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: elevation,
                marginLeft: 10,
                marginRight: 10,
              }}
              onPress={() => {
                onItemCLick(item, index);
              }}
            >
              <View
                style={{
                  width: "98%",
                  flexDirection: "row",
                  height: 35,
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <TextCommonMedium
                    text={item.name}
                    color={COLORS.black_txt}
                    fontSize={FONTS_SIZE.txt_14}
                    fontWeight={"600"}
                    textAlign={"left"}
                  />
                </View>
                {item.isSelected ? (
                  <Image
                    source={require("../assets/right_icon.png")}
                    resizeMode={"contain"}
                    style={{
                      tintColor: COLORS.colorGreen,
                      height: 24,
                      width: 24,
                    }}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => {
          return <EmptyView msgText={"No data found"} />;
          // return isLoading === false ? (
          //     <EmptyView msgText={'No data found'} />
          // ) : null;
        }}
        keyExtractor={(_, index) => index.toString()}
      />
      <Loader loading={isLoading} />
    </View>
  );
}

export default SelectCityPage;
