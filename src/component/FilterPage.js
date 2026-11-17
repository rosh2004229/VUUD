import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import { COLORS, FONTS_SIZE, activeOpacity } from '../common/utils';
import ToolbarBackButton from '../common/ToolbarBackButton';
import TextCommonMedium from '../common/TextCommonMedium';
import ButtonView from '../common/ButtonView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function FilterPage({ route, navigation }) {
  const [cat_id, setCat_id] = useState('');
  const [cat_name, setCat_name] = useState('');

  const [state, setState] = useState('');
  const [state_id, setState_id] = useState('');

  const [city, setCity] = useState('');
  const [city_id, setCity_id] = useState('');

  useFocusEffect(
    useCallback(() => {
      setCat_id('');
      setCat_name('');
      setState('');
      setState_id('');
      setState('');
      setCity('');
      setCity_id();
      onGetData();
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
      return () => {
        subscription.remove();
      };
    }, [])
  );

  const onGetData = async () => {
    // set Category
    const cat_id_bd = await AsyncStorage.getItem('cat_id');
    if (cat_id_bd != undefined) {
      setCat_id(cat_id_bd.toString());
    }
    const cat_name_bd = await AsyncStorage.getItem('cat_name');
    if (cat_name_bd != undefined) {
      setCat_name(cat_name_bd.toString());
    }

    // set state
    const state_id_bd = await AsyncStorage.getItem('state_id');
    if (state_id_bd != undefined) {
      setState_id(state_id_bd.toString());
    }
    const state_bd = await AsyncStorage.getItem('state');
    if (state_bd != undefined) {
      setState(state_bd.toString());
    }

    // set City
    const city_id_bd = await AsyncStorage.getItem('city_id');
    if (city_id_bd != undefined) {
      setCity_id(city_id_bd.toString());
    }

    const city_bd = await AsyncStorage.getItem('city');
    if (city_bd != undefined) {
      setCity(city_bd.toString());
    }
  };

  const handleBackButtonClick = async () => {
    const isBackStack_save = await AsyncStorage.getItem('isBackStack_save');
    if (isBackStack_save != undefined) {
      navigation.goBack(null);
    } else {
      onClearClick();
    }
    return true;
  };

  const onClearClick = () => {
    AsyncStorage.removeItem('cat_id');
    AsyncStorage.removeItem('cat_name');
    AsyncStorage.removeItem('state_id');
    AsyncStorage.removeItem('state');
    AsyncStorage.removeItem('city_id');
    AsyncStorage.removeItem('city');
    AsyncStorage.removeItem('selectFilterCategory');
    AsyncStorage.removeItem('selectFilterCity');
    AsyncStorage.removeItem('selectFilterState');
    AsyncStorage.removeItem('isBackStack_save');
    navigation.goBack(null);
  };

  const onSearchClick = async () => {
    const cat_id_bd = await AsyncStorage.getItem('cat_id');
    if (cat_id_bd != undefined) {
      AsyncStorage.setItem('cat_id', cat_id_bd.toString());
    }
    const cat_name_bd = await AsyncStorage.getItem('cat_name');
    if (cat_name_bd != undefined) {
      AsyncStorage.setItem('cat_name', cat_name_bd.toString());
    }
    const state_id_bd = await AsyncStorage.getItem('state_id');
    if (state_id_bd != undefined) {
      AsyncStorage.setItem('state_id', state_id_bd.toString());
    }
    const state_bd = await AsyncStorage.getItem('state');
    if (state_bd != undefined) {
      AsyncStorage.setItem('state', state_bd.toString());
    }
    const city_id_bd = await AsyncStorage.getItem('city_id');
    if (city_id_bd != undefined) {
      AsyncStorage.setItem('city_id', city_id_bd.toString());
    }
    const city_bd = await AsyncStorage.getItem('city');
    if (city_bd != undefined) {
      AsyncStorage.setItem('city', city_bd.toString());
    }
    AsyncStorage.setItem('isBackStack_save', 'true');
    navigation.goBack(null);
  };

  const goToSelectionPage = (title) => {
    navigation.navigate('SelectDataPage', { title });
  };

  const filterItemView = (lable, value) => {
    return (
      <TouchableOpacity
        onPress={() => goToSelectionPage(lable)}
        activeOpacity={activeOpacity}
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          paddingVertical: 15,
          paddingHorizontal: 10,
          width: '100%',
          marginVertical: 5,
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: -2, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextCommonMedium
          text={value}
          color={
            value != 'City' && value != 'Category'
              ? COLORS.black_txt
              : COLORS.gry_text
          }
          fontSize={FONTS_SIZE.txt_14}
          fontWeight={'500'}
          marginLeft={5}
        />
        <Image
          source={require('../assets/next.png')}
          style={{
            width: 15,
            height: 15,
            position: 'absolute',
            right: 15,
            tintColor: COLORS.gry_text,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <ScrollView
        style={{ height: '100%', width: '100%', flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ToolbarBackButton
          btnText={'Search Influencer'}
          onBackPress={() => handleBackButtonClick()}
        />

        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            flex: 1,
          }}
        >
          {filterItemView('Category', cat_name != '' ? cat_name : 'Category')}
          {filterItemView('City', city != '' ? city : 'City')}
          {/* {filterItemView('State', state != "" ? state : 'State')} */}

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: 20,
            }}
          >
            <View
              style={{
                flex: 0.5,
              }}
            >
              <ButtonView
                btnText={'CLEAR'}
                visible={true}
                btntxColor={COLORS.color_toolbar_btn_BG}
                borderColor={COLORS.color_toolbar_btn_BG}
                onPress={() => onClearClick()}
              />
            </View>
            <View style={{ width: 10 }} />

            <View
              style={{
                flex: 0.5,
              }}
            >
              <ButtonView
                btnText={'SEARCH'}
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
  );
}

export default FilterPage;
