import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import APIWebCall from '../../common/APIWebCall';
import ButtonView from '../../common/ButtonView';
import DialogForcefullyDetails from '../../common/DialogForcefullyDetails';
import InternetPermission from '../../common/InternetPermission';
import Loader from '../../common/LoadingScreen';
import TextCommonMedium from '../../common/TextCommonMedium';
import ToolbarBackButton from '../../common/ToolbarBackButton';
import statusView from '../../common/statusView';
import {
    BASE_URL,
    COLORS,
    FONTS_SIZE,
    activeOpacity
} from '../../common/utils';
var count = 0;
let { width, height } = Dimensions.get('window');
let boxCount = 2;
let boxWidth = width / boxCount;

function CityAndCountryAddPage({ navigation }) {
    const [isLoading, setisLoading] = useState(false);
    const [city, setCity] = useState('');
    const [city_id, setCity_id] = useState('');
    const [country, setCountry] = useState('');
    const [country_id, setCountry_id] = useState('');
    const [statusProgressCount, setStatusProgressCount] = useState(8);
    const [isModelVisible, setIsModelVisible] = useState(false);

    const selectData = [{ "id": 105, "isSelected": true, "name": "India" }]

    useEffect(() => {
        setCity('');
        setCountry('India');
        setCity_id();
        setCountry_id('105');
        AsyncStorage.setItem("selectFilterCountry_edit", JSON.stringify(selectData))
    }, []);

    useFocusEffect(
        useCallback(() => {
            onGetData();
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    handleBackButtonClick
                );
            };
        }, [])
    );

    const handleBackButtonClick = async () => {
        removeDb_key();
        return true;
    };

    const removeDb_key = async () => {
        AsyncStorage.removeItem('selectFilterCity_edit');
        AsyncStorage.removeItem('city_id_edit');
        AsyncStorage.removeItem('city_edit');
        AsyncStorage.removeItem('selectFilterCountry_edit');
        AsyncStorage.removeItem('country_id_edit');
        AsyncStorage.removeItem('country_edit');
        navigation.goBack(null);
    };
    const onGetData = async () => {
        // set City
        const city_id_bd = await AsyncStorage.getItem('city_id_edit');
        if (city_id_bd != undefined) {
            setCity_id(city_id_bd.toString());
        }
        const city_bd = await AsyncStorage.getItem('city_edit');
        if (city_bd != undefined) {
            setCity(city_bd.toString());
        }
        // set Country
        const country_id_bd = await AsyncStorage.getItem('country_id_edit');
        if (country_id_bd != undefined) {
            setCountry_id(country_id_bd.toString());
        }
        const country_bd = await AsyncStorage.getItem('country_edit');
        if (country_bd != undefined) {
            setCountry(country_bd.toString());
        }
    };


    const goToSelectionPage = (title) => {
        if (title === 'City') {
            navigation.navigate('SelectCityPage', {
                title: title,
            });
        } else {
            navigation.navigate('SelectCountryPage', {
                title: title,
            });
        }
    };

    const filterItemView = (lable, value) => {
        // console.log("sdefsdfsfsfsf2222222222", lable);
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
                    height: 65,
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
                    color={COLORS.black_txt}
                    fontSize={FONTS_SIZE.txt_14}
                    fontWeight={'500'}
                    width={wp(74.5)}
                    marginLeft={1}
                />

                <Image
                    source={require('../../assets/next.png')}
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

    const onNextClick = async () => {
        Keyboard.dismiss();
        if (city === '') {
            showMessage({
                message: 'Select city ',
                type: 'danger',
            });
        } else if (country === '') {
            showMessage({
                message: 'Select country ',
                type: 'danger',
            });
        } else {

            var user_id = await AsyncStorage.getItem('user_id');
            var isInternetGranted =
                await InternetPermission.checkInternetPermissions();
            var data = new FormData();
            data.append('user_id', user_id);
            data.append('country_id', country_id);
            data.append('city_id', city_id);
            data.append('step', 8);
            if (isInternetGranted == true) {
                cityAddApiCall(data);
            }
        }

    };


    const cityAddApiCall = (data) => {
        setisLoading(true);
        console.log("[CityAndCountryAddPage] addCity API Triggered");
        console.log("[CityAndCountryAddPage] Endpoint: addCity");
        console.log("[CityAndCountryAddPage] Full URL:", BASE_URL + "addCity");
        console.log("[CityAndCountryAddPage] Payload:", {
            country_id: country_id,
            city_id: city_id,
            step: 8,
        });
        APIWebCall.onCityAddApiCall(data)
            .then(async (response) => {
                setisLoading(false);
                console.log("[CityAndCountryAddPage] addCity Response:", response);
                if (response.data != null || response.data != undefined) {
                    setIsModelVisible(true);
                } else {
                    showMessage({
                        message: response.message,
                        type: 'danger',
                    });
                }
            })
            .catch((err) => {
                console.log("[CityAndCountryAddPage] addCity Error:", err);
                setisLoading(false);
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
            })
            .finally(() => setisLoading(false));
    };


    return (
        <ImageBackground
            style={{ width: wp(100), height: hp(100) }}
            source={require('../../assets/bg_3.png')}
        >

            <View style={{ flex: 1 }}>
                <ToolbarBackButton
                    btnText={'Add Location'}
                    onBackPress={() => navigation.goBack()}
                />
                <ScrollView style={{ height: '100%', width: '100%' }}>
                    <View style={{ marginLeft: 10, marginRight: 10, marginTop: 5 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                                marginBottom: 15,
                            }}
                        >
                            {statusView(statusProgressCount, 1, 'Name')}
                            {statusView(statusProgressCount, 2, 'Profile Pic')}
                            {statusView(statusProgressCount, 3, 'User Type')}
                            {statusView(statusProgressCount, 4, 'Social')}
                            {statusView(statusProgressCount, 5, 'Category')}
                            {statusView(statusProgressCount, 6, 'Media')}
                            {statusView(statusProgressCount, 7, 'Keywords')}
                            {statusView(statusProgressCount, 8, 'Country')}
                        </View>

                        <View
                            style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginTop: 5,
                            }}
                        >
                            <View
                                style={{
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingBottom: 0,
                                    marginTop: 5,
                                    flex: 1,
                                }}
                            >
                                {filterItemView('Country', country != '' ? country : 'India')}
                            </View>

                            <View>
                                <View
                                    style={{
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        paddingBottom: 0,
                                        marginTop: 5,
                                        flex: 1,
                                    }}
                                >
                                    {filterItemView('City', city != '' ? city : 'City')}
                                </View>

                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        width: '95%',
                        alignSelf: 'center',
                    }}
                >
                    <ButtonView
                        backgroundColor={COLORS.colorGreen}
                        btnText={'Complete'}
                        btntxColor={COLORS.white_txt}
                        borderColor={COLORS.colorGreen}
                        onPress={() => { onNextClick() }}
                    />
                </View>
                <Loader loading={isLoading} />
            </View>

            <DialogForcefullyDetails
                loading={isModelVisible}
                iconColor={COLORS.primary}
                msg_text={'Your Influenstar profile has been successfully created. Continue to explore!'}
                msg_title={'Congratulations'}
                rightButtonText={'Continue'}
                onPressRightButton={() => {
                    setIsModelVisible(false);
                    AsyncStorage.removeItem('selected_category_ayy');
                    AsyncStorage.setItem('is_confirm', 'true');
                    setTimeout(() => {
                        // navigation.dispatch(StackActions.replace('Drawer_Menu'));
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Drawer_Menu' }],
                        });
                    }, 120);
                }}
            />
        </ImageBackground>
    );
}



export default CityAndCountryAddPage;
