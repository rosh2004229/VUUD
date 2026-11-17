import React, { useCallback, useContext, useState } from 'react';
import { TouchableOpacity, FlatList, View, Image } from 'react-native';
import { COLORS, FONTS_SIZE, activeOpacity, elevation } from '../common/utils';
import ToolbarBackButton from '../common/ToolbarBackButton';
import TextCommonMedium from '../common/TextCommonMedium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../common/LoadingScreen';
import InternetPermission from '../common/InternetPermission';
import APIWebCall from '../common/APIWebCall';
import SnackBarCommon from '../common/SnackBarCommon';
var _ = require('lodash');

function SelectDataPage({ route, navigation }) {
  const { title } = route.params;


  const [dataList, setDataList] = useState([]);


  const [selectFilterCategory, setSelectedFilterCategory] = useState([]);
  const [selectFilterCity, setSelectedFilterCity] = useState([]);
  const [selectFilterState, setSelectedFilterState] = useState([]);


  const [stateId, setStateId] = useState('');
  const [state, setState] = useState('');

  const [cityId, setCityId] = useState('');
  const [city, setCity] = useState('');

  const [cat, setCat] = useState('');
  const [cat_id, setCat_id] = useState('');
  const [isLoading, setisLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setState('');
      setStateId('');
      setCity('');
      setCityId('')
      setCat('');
      setCat_id('')
    getSelectedCategory();
    }, [title]),
  );

  const getSelectedCategory = async ()=>{
    setDataList([]);
    setSelectedFilterCity([]);
    setSelectedFilterCategory([])
    console.log("title ======> ", title);
    const selectFilterState_db = await AsyncStorage.getItem('selectFilterState');
    switch (title) {
      case 'Category':
      var isInternetGranted = await InternetPermission.checkInternetPermissions();
      if (isInternetGranted == true) {
        onInfluencerCategoryListAPICall();
      }
      break;
    
      case 'City':     
      var isInternetGranted = await InternetPermission.checkInternetPermissions();
      if (isInternetGranted == true) {
        onGetCityListAPICall();
      }
      
      break;
      
      case 'State':        
      const updatedArrayState = dataList.map(item => {
        const selectedItem = selectFilterState_db.flat().find(selected => selected.id === item.id);
        if (selectedItem) {
          return { ...item, isSelected: selectedItem.isSelected };
        }
        return item;
      });
      setDataList(updatedArrayState);
      break;

      default:
        break;
    }
}

const onGetCityListAPICall = async () => {
  const selectFilterCity_db = await AsyncStorage.getItem('selectFilterCity'); 
  console.log({selectFilterCity_db});
  setisLoading(true);
  APIWebCall.onGetCityListAPICall()
    .then(async (response) => {
      setisLoading(false);
      var city_Ayy = [];
      if (response.data.city != undefined && response.data.city != null) {
        if(response.data.city.length> 0 ){
          response.data.city.forEach(element => {
            var obj = {
              name: element.city, isSelected: false , id: element.id
            }
            city_Ayy.push(obj);            
          });
        }
        if(selectFilterCity_db != null){
          var selectFilterCity_db_parse = JSON.parse(selectFilterCity_db);
           const updatedArrayCity = city_Ayy.map(item => {
        const selectedItem = selectFilterCity_db_parse.flat().find(selected => selected.id === item.id);
        if (selectedItem) {
          return { ...item, isSelected: selectedItem.isSelected };
        }
        return item;
      });
      setDataList(updatedArrayCity);
        }
        else{
          setDataList(city_Ayy);
        }
         
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


const onInfluencerCategoryListAPICall = async () => {
  const selectFilterCategory_db = await AsyncStorage.getItem('selectFilterCategory');
  console.log({selectFilterCategory_db});

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
        categories.forEach(element => {
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
      if (selectFilterCategory_db != null) {
        var selectFilterCategory_db_parse = JSON.parse(selectFilterCategory_db);
        const updatedArrayCat = category_Ayy.map(item => {
          const selectedItem = selectFilterCategory_db_parse.flat().find(selected => selected.id === item.id);
          if (selectedItem) {
            return { ...item, isSelected: selectedItem.isSelected };
          }
          return item;
        });
        setDataList(updatedArrayCat);
      } else {
        setDataList(category_Ayy);
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

  const onItemCLick = (item, index) => {   
                switch (title) {
                  case 'Category':                 
                  var temp = [...dataList];
                  temp.forEach((element, idx) => {
                            if(idx === index){
                                element.isSelected = true       
                            }
                            else{
                              element.isSelected = false ;
                            }
                            
                          });
                          const selected_Category_Filter = _.filter(
                            temp,
                            item => item.isSelected === true,
                          );

                          setDataList(temp);
                          setCat_id(item.id);
                          setCat(item.name);
                          setSelectedFilterCategory(selected_Category_Filter);            
                  break;

                  case 'City':                 
                  var temp = [...dataList];
                  temp.forEach((element, idx) => {
                            if(idx === index){
                                element.isSelected = true       
                            }
                            else{
                              element.isSelected = false ;
                            }
                            
                          });
                          const selected_City_Filter = _.filter(
                            temp,
                            item => item.isSelected === true,
                          );

                          setDataList(temp);
                          setCityId(item.id);
                          setCity(item.name);
                          setSelectedFilterCity(selected_City_Filter);
            
                  break;
                  case 'State':                 
                  var temp = [...dataList];
                  temp.forEach((element, idx) => {
                            if(idx === index){
                                element.isSelected = true       
                            }
                            else{
                              element.isSelected = false ;
                            }                            
                          });
                          const selected_State_Filter = _.filter(
                            temp,
                            item => item.isSelected === true,
                          );
                          setDataList(temp);
                          setStateId(item.id);
                          setState(item.name);
                          setSelectedFilterState(selected_State_Filter);
            
                  break;
                  default:
                    break;
                }



  }

  const onRightClick = () => {
    switch (title) {
      case 'Category':        
      if(selectFilterCategory.length > 0 ){
          AsyncStorage.setItem("selectFilterCategory", JSON.stringify(selectFilterCategory))
          AsyncStorage.setItem("cat_id", cat_id.toString());
          AsyncStorage.setItem("cat_name", cat);
      }
      navigation.navigate("FilterPage");
      break;
    

      case 'City':        
      if(selectFilterCity.length > 0 ){
          AsyncStorage.setItem("selectFilterCity", JSON.stringify(selectFilterCity))
          AsyncStorage.setItem("city_id", cityId.toString());
          AsyncStorage.setItem("city", city);
      }
      navigation.navigate("FilterPage");
      break;
      
      case 'State':        
      if(selectFilterState.length > 0 ){
          AsyncStorage.setItem("selectFilterState", JSON.stringify(selectFilterState))
          AsyncStorage.setItem("state_id", stateId.toString());
          AsyncStorage.setItem("state", state);
      }
      navigation.navigate("FilterPage");
      break;

      default:
        break;
    }
   
}

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <ToolbarBackButton
        btnText={title}
        onBackPress={() => navigation.navigate('FilterPage')}
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
                onItemCLick(item, index)
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

export default SelectDataPage;
