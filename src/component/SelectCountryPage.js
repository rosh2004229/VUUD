import React, { useCallback, useContext, useState } from 'react';
import { TouchableOpacity, FlatList, View, Image, TextInput } from 'react-native';
import { COLORS, FONTS, FONTS_SIZE, activeOpacity, elevation } from '../common/utils';
import ToolbarBackButton from '../common/ToolbarBackButton';
import TextCommonMedium from '../common/TextCommonMedium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../common/LoadingScreen';
import InternetPermission from '../common/InternetPermission';
import APIWebCall from '../common/APIWebCall';
import SnackBarCommon from '../common/SnackBarCommon';
import EmptyView from '../common/EmptyView';
var _ = require('lodash');

function SelectCountryPage({ route, navigation }) {
    const { title } = route.params;


    const [dataList, setDataList] = useState([]);
    const [searchCountry, setSearchCountry] = useState("")

    // const [selectFilterCategory, setSelectedFilterCategory] = useState([]);
    const [selectFilterCountry, setSelectedFilterCountry] = useState([]);


    // const [stateId, setStateId] = useState('');

    const [countryId, setCountryId] = useState('');
    const [country, setCountry] = useState('');


    //   const [cat, setCat] = useState('');
    //   const [cat_id, setCat_id] = useState('');
    const [isLoading, setisLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setCountry('');
            setCountryId('')
            getSelectedCategory("");
            setSearchCountry('')
            setDataList([]);
            setSelectedFilterCountry([]);
        }, [title]),
    );

    const getSelectedCategory = async (searchValue) => {
        switch (title) {
            case 'Country':
                var isInternetGranted = await InternetPermission.checkInternetPermissions();
                if (isInternetGranted == true) {
                    // onGetCityListAPICall();
                    if (searchValue === '') {
                        setisLoading(true);
                    }
                    var data = new FormData();
                    data.append('filter', searchValue);
                    onGetCountryListAPICall(data);
                }
                break;
            default:
                break;
        }
    }

    const onGetCountryListAPICall = async (data) => {
        const selectFilterCountry_db = await AsyncStorage.getItem('selectFilterCountry_edit');
        console.log({ selectFilterCountry_db });
        // setisLoading(true);
        APIWebCall.onGetCountryListAPICall(data)
            .then(async (response) => {
                // console.log("response------------------->", response.data.country)
                setisLoading(false);
                var country_Ayy = [];
                if (response.data.country != undefined && response.data.country != null) {
                    if (response.data.country.length > 0) {
                        response.data.country.forEach(element => {
                            // console.log("element-------------------", element)
                            var obj = {
                                name: element.name, isSelected: false, id: element.id
                            }
                            country_Ayy.push(obj);
                        });
                    } else {
                        setDataList([]);
                    }
                    if (selectFilterCountry_db != null) {
                        var selectFilterCountry_db_parse = JSON.parse(selectFilterCountry_db);
                        const updatedArrayCountry = country_Ayy.map(item => {
                            const selectedItem = selectFilterCountry_db_parse.flat().find(selected => selected.id === item.id);
                            if (selectedItem) {
                                return { ...item, isSelected: selectedItem.isSelected };
                            }
                            return item;
                        });
                        setDataList(updatedArrayCountry);
                    }
                    else {
                        setDataList(country_Ayy);
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
        console.log("onItemCLick-----------------------11818181818", item)
        switch (title) {

            case 'Country':
                var temp = [...dataList];
                temp.forEach((element, idx) => {
                    if (idx === index) {
                        element.isSelected = true
                    }
                    else {
                        element.isSelected = false;
                    }

                });
                const selected_Country_Filter = _.filter(
                    temp,
                    item => item.isSelected === true,
                );

                setDataList(temp);
                setCountryId(item.id);
                setCountry(item.name);
                setSelectedFilterCountry(selected_Country_Filter);
                break;

            default:
                break;
        }
    }

    const onRightClick = () => {
        switch (title) {
            case 'Country':
                if (selectFilterCountry.length > 0) {
                    AsyncStorage.setItem("selectFilterCountry_edit", JSON.stringify(selectFilterCountry))
                    AsyncStorage.setItem("country_id_edit", countryId.toString());
                    AsyncStorage.setItem("country_edit", country);
                }
                navigation.goBack(null);
                break;

            default:
                break;
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
            <ToolbarBackButton
                btnText={title}
                // onBackPress={() => navigation.navigate("EditProfilePage")}
                onBackPress={() => navigation.goBack(null)}
                rightIcon={require('../assets/right_icon.png')}
                onRightClick={() => onRightClick()}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
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
                        source={require('../assets/search_icon.png')}
                    />
                </View>
                <View
                    style={{
                        marginLeft: 5,
                        height: 50,
                        width: '85%',
                    }}
                >
                    <TextInput
                        style={{
                            color: COLORS.black_txt,
                            fontSize: FONTS_SIZE.txt_14,
                            fontFamily: FONTS.FontRegular,
                            textAlign: 'left',
                            flex: 1,
                            //marginLeft: 10,
                        }}
                        placeholder="Search for country"
                        placeholderTextColor={COLORS.gry_light}
                        onChangeText={(newText) => {
                            setSearchCountry(newText);
                            if (newText != '') {
                                getSelectedCategory(newText);
                            } else {
                                getSelectedCategory('');
                            }
                        }}
                        value={searchCountry}
                        returnKeyType={'default'}
                        onSubmitEditing={() => {
                            getSelectedCategory(searchCountry);
                        }}
                    />
                </View>
            </View>

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
                ListEmptyComponent={() => {
                    return <EmptyView msgText={'No data found'} />
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

export default SelectCountryPage;
