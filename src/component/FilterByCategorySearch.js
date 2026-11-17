import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS_SIZE, activeOpacity } from "../common/utils";
import ToolbarBackButton from "../common/ToolbarBackButton";
import TextCommonMedium from "../common/TextCommonMedium";
import TextInputView from "../common/TextInputView";
import ButtonView from "../common/ButtonView";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FilterMContext = React.createContext();

function FilterByCategorySearch({ route, navigation }) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [selectedValuesCat, setSelectedValuesCat] = useState([]);

  useEffect(() => {
    console.log("updated values ===> ", selectedValuesCat);
  }, [selectedValuesCat]);

  const onClearClick = () => {
    AsyncStorage.removeItem("cat_id");
    AsyncStorage.removeItem("cat_name");
    AsyncStorage.removeItem("state_id");
    AsyncStorage.removeItem("state");
    AsyncStorage.removeItem("city_id");
    AsyncStorage.removeItem("city");
    navigation.goBack(null);
  };

  const onSearchClick = async () => {
    const cat_id_bd = await AsyncStorage.getItem("cat_id");
    if (cat_id_bd != undefined) {
      AsyncStorage.setItem("cat_id", cat_id_bd.toString());
    }
    const cat_name_bd = await AsyncStorage.getItem("cat_name");
    if (cat_name_bd != undefined) {
      AsyncStorage.setItem("cat_name", cat_name_bd.toString());
    }
    const state_id_bd = await AsyncStorage.getItem("state_id");
    if (state_id_bd != undefined) {
      AsyncStorage.setItem("state_id", state_id_bd.toString());
    }
    const state_bd = await AsyncStorage.getItem("state");
    if (state_bd != undefined) {
      AsyncStorage.setItem("state", state_bd.toString());
    }
    const city_id_bd = await AsyncStorage.getItem("city_id");
    if (city_id_bd != undefined) {
      AsyncStorage.setItem("city_id", city_id_bd.toString());
    }
    const city_bd = await AsyncStorage.getItem("city");
    if (city_bd != undefined) {
      AsyncStorage.setItem("city", city_bd.toString());
    }
    navigation.goBack(null);
  };

  const goToSelectionPage = (title) => {
    navigation.navigate("SelectDataPage", { title: title });
  };

  const filterItemView = (lable) => {
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
          marginVertical: 5,
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: -2, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <TextCommonMedium
          text={lable}
          color={COLORS.black_txt}
          fontSize={FONTS_SIZE.txt_14}
          fontWeight={"500"}
          marginLeft={5}
        />
        <Image
          source={require("../assets/next.png")}
          style={{
            width: 15,
            height: 15,
            position: "absolute",
            right: 15
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FilterMContext.Provider value={(selectedValuesCat, setSelectedValuesCat)}>
      <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
        <ScrollView
          style={{ height: "100%", width: "100%", flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <ToolbarBackButton
            btnText={"Search By Category"}
            onBackPress={() => navigation.goBack()}
          />

          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 10,
              flex: 1
            }}
          >
            {filterItemView("Category")}
            {/* {filterItemView("City")}
            {filterItemView("State")} */}

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                alignSelf: "center",
                marginTop: 20
              }}
            >
              <View
                style={{
                  flex: 0.5
                }}
              >
                <ButtonView
                  btnText={"CLEAR"}
                  visible={true}
                  btntxColor={COLORS.color_toolbar_btn_BG}
                  borderColor={COLORS.color_toolbar_btn_BG}
                  onPress={() => onClearClick()}
                />
              </View>
              <View style={{ width: 10 }} />

              <View
                style={{
                  flex: 0.5
                }}
              >
                <ButtonView
                  btnText={"SEARCH"}
                  visible={true}
                  backgroundColor={COLORS.colorGreen}
                  btntxColor={COLORS.white_txt}
                  borderColor={COLORS.colorGreen}
                  onPress={() => onSearchClick()}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </FilterMContext.Provider>
  );
}

export default FilterByCategorySearch;
