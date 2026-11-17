import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, View, Image } from 'react-native';
import { COLORS, FONTS_SIZE, activeOpacity, elevation } from '../common/utils';
import ToolbarBackButton from '../common/ToolbarBackButton';
import TextCommonMedium from '../common/TextCommonMedium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import InternetPermission from '../common/InternetPermission';
import APIWebCall from '../common/APIWebCall';
import SnackBarCommon from '../common/SnackBarCommon';
import Loader from '../common/LoadingScreen';
var _ = require('lodash');

function SelectCategoryPage({ route, navigation }) {
  const { title, selectedValuesArr } = route.params;

  const [dataList, setDataList] = useState([]);

  const [selected_Category_Pass_Ayy, setSelected_Category_Pass_Ayy] = useState(
    []
  );
  const [isLoading, setisLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSelected_Category_Pass_Ayy([]);
      getSelectedCategory();
    }, [])
  );

  const getSelectedCategory = async () => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      onInfluencerCategoryListAPICall();
    }
  };

  const onInfluencerCategoryListAPICall = async () => {
    console.log({ selectedValuesArr });
    setisLoading(true);
    APIWebCall.onInfluencerCategoryListAPICall()
      .then(async (response) => {
        setisLoading(false);
        console.log("[SelectCategoryPage] getCaterory Response:", response);
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
              id: element?.id,
              ...element,
            };
            category_Ayy.push(obj);
          });
        }
        if (selectedValuesArr.length > 0) {
          const updatedArray = category_Ayy.map((item) => {
            const selectedItem = selectedValuesArr
              .flat()
              .find((selected) => selected.id === item.id);
            if (selectedItem) {
              return { ...item, isSelected: selectedItem.isSelected };
            }
            return item;
          });
          setDataList(updatedArray);
        } else {
          setDataList(category_Ayy);
        }
      })
      .catch((err) => {
        console.log("[SelectCategoryPage] getCaterory Error:", err);
        setisLoading(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load categories";
        setTimeout(() => {
          SnackBarCommon({ text: errMsg });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const onRightClick = () => {
    console.log({ selected_Category_Pass_Ayy });
    if (selected_Category_Pass_Ayy.length > 0) {
      AsyncStorage.setItem(
        'selected_category_ayy',
        JSON.stringify(selected_Category_Pass_Ayy)
      );
    } else {
      AsyncStorage.removeItem('selected_category_ayy');
    }
    // navigation.navigate('RegisterPage');
    navigation.goBack()
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <ToolbarBackButton
        btnText={title}
        onBackPress={() => navigation.goBack()}
        rightIcon={require('../assets/right_icon.png')}
        onRightClick={() => onRightClick()}
      />
      <FlatList
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={'always'}
        data={dataList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          alignItems: 'center',
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
                width: '93%',
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
                var temp = [...dataList];
                temp[index].isSelected = !temp[index].isSelected;
                setDataList(temp);

                const selected_Category_ayy = _.filter(
                  temp,
                  (item) => item.isSelected === true
                );
                setSelected_Category_Pass_Ayy(selected_Category_ayy);
              }}
            >
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  height: 35,
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <TextCommonMedium
                    text={item.name}
                    color={COLORS.black_txt}
                    fontSize={FONTS_SIZE.txt_14}
                    fontWeight={'600'}
                    textAlign={'left'}
                  />
                </View>
                {item.isSelected ? (
                  <Image
                    source={require('../assets/right_icon.png')}
                    resizeMode={'contain'}
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
        //   ListEmptyComponent={() => {
        //     return isLoading === false ? (
        //       <ListEmptyView txt={'No data found'} />
        //     ) : null;
        //   }}
        keyExtractor={(_, index) => index.toString()}
      />
      <Loader loading={isLoading} />
    </View>
  );
}

export default SelectCategoryPage;
